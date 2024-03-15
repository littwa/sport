import {
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    OnGatewayInit,
    WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAuthInterceptor } from 'src/interceptors/ws-auth.interceptor';
import { WebsocketExceptionsFilter } from 'src/filters/ws.exception.filter';
import { Bind, UseFilters, UseInterceptors } from '@nestjs/common';
import { BattleshipsService } from './battleships.service';
import { UsersService } from '../users/users.service';
import {IBattleshipsGame, IBattleshipsStep} from '../../shared/interfaces/battleships.interfaces';

@WebSocketGateway({
    namespace: 'battleships',
    cors: {
        origin: '*',
    },
})
@UseInterceptors(WsAuthInterceptor)
@UseFilters(WebsocketExceptionsFilter)
export class BattleshipsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer()
    server: Server;
    users = [];
    games = [];

    constructor(
        private battleshipsService: BattleshipsService,
        private usersService: UsersService,
    ) {}

    @Bind(MessageBody(), ConnectedSocket())
    @SubscribeMessage('add_game')
    async addGame(params: any, socket: Socket) {
        const game: IBattleshipsGame = {
            serverUid: socket.data.decode.payload.uid,
            serverSocketId: socket.id,
            clientUid: null,
            clientSocketId: null,
            timestamp: new Date().toISOString(),
            roomName: Date.now().toString(),
            params,
        };

        // this.server.in(game.serverSocketId).socketsJoin(game.roomName);
        socket.join(game.roomName);
        this.games.push(game);
        console.log('add-game: : ', params, socket.id);
        // console.log('socket: ', socket);
        console.log('--------------------------------------');
        // // console.log('server: ', this.server);
        console.log('--------------------------------------');
        this.server.emit('get-games', { data: this.games }); // get-games
        return { event: 'add-game', data: game };
    }

    @Bind(MessageBody(), ConnectedSocket())
    @SubscribeMessage('get-games')
    async handle(data: any, socket: Socket) {
        // @ts-ignore
        // return of(data) as Observable;
        // return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
        // console.log(111, data, socket)
        // return from([data]).pipe(map(item => ({ event: 'events', data: item })));
        const games = { q: 2 };
        // const chats = await this.chatService.getAllChats();
        // console.log(chats)
        // this.server.emit('events', { data, id: socket.id });
        return { event: 'get-games', data: this.games };
    }

    @Bind(MessageBody(), ConnectedSocket())
    @SubscribeMessage('join-game')
    async joinGame(value: any, socket: Socket) {
        // console.log('socket.id:: ', socket.id);
        // console.log('sever: ', this.server);
        // this.server.in(socket.id).socketsJoin(game.serverSocketId);
        let data: any;
        this.server.in(socket.id).socketsJoin(value.roomName);
        this.games = this.games.map(g => {
            if (g.roomName === value.roomName) {
                g.clientUid = socket.data.decode.payload.uid;
                g.clientSocketId = socket.id;
                data = g;
            }
            return g;
        });

        console.log(data);
        const list = await this.server.in(data.roomName).fetchSockets();

        console.log(
            1,
            list.map(v => v.id),
        );
        // const data =  this.chatService.joinChat(chat, socket);

        //console.log('sever rooms:: ', this.server.sockets.adapter.rooms);
        this.server.emit('get-games', { data: this.games });
        // this.server.to(data.roomName).emit('join-game', data);

        return { event: 'join-game', data };
    }

    @Bind(MessageBody(), ConnectedSocket())
    @SubscribeMessage('leave-game')
    async leaveGame(game: IBattleshipsGame, socket: Socket) {
        let data: any;
        if (game.serverSocketId === socket.id) {
            this.server.in(game.roomName).socketsLeave(game.roomName); // del all sockets(users) from room, need to check
            this.games = this.games.filter(g => g.serverSocketId !== socket.id);
            data = game;
        } else {
            this.server.in(socket.id).socketsLeave(game.roomName);
            this.games = this.games.map(g => {
                if (g.clientSocketId === socket.id) {
                    g.clientSocketId = null;
                    g.clientUid = null;
                }
                data = g;
                return g;
            });
        }

        this.server.emit('get-games', { data: this.games });
        return { event: 'leave-game', data };
    }

    @Bind(MessageBody(), ConnectedSocket())
    @SubscribeMessage('start-game')
    async handleGame(data: IBattleshipsGame, socket: Socket) {

        const game = await this.battleshipsService.createGame(data, socket);

        this.server.to(data.roomName).emit('start-game', game);
        // this.server.to(data.roomName).emit('step-game', game);

        this.games = this.games.filter(data => data.serverSocketId !== socket.id);

        // return { event: 'start-game', data: game };
    }

    @Bind(MessageBody(), ConnectedSocket())
    @SubscribeMessage('step-game')
    async stepGame(data: IBattleshipsStep, socket: Socket) {
        const game = await this.battleshipsService.execute(data, socket);

        const list = await this.server.in(game.room).fetchSockets();
        console.log('sockets id:: ', list.map(v => v.id));

        if(!list.map(v => v.id).includes(socket.id)) {
            socket.join(game.room);
            // this.server.in(socket.id).socketsJoin(value.roomName); // the same^
        }

        this.server.to(game.room).emit('step-game', game);

        // return { event: 'step-game', data: game };
    }

    async afterInit(data: Socket) {
        console.log('init websockets battleship');
    }

    async handleConnection(socket: Socket) {
        const result = await this.battleshipsService.socketService.checkUserFromSocket(socket);

        if (result.uid) {
            this.users.push(result.uid);
        }

        if (!result.uid) {
            this.server.emit('exception', result);
        }

        this.server.emit('get-games', { data: this.games });
        // return { event: 'get-games', data: games };

        this.server.emit('client-connecting', { occasion: 'client-connecting', result, users: this.users });
    }

    async handleDisconnect(socket: Socket) {
        const { authorization } = socket.handshake.headers;
        const decode = this.usersService.decodeAnyToken(authorization) as any;

        // A client has disconnected
        // this.logger.log('Client disconnected');
        this.users = this.users.filter(uid => uid !== decode?.payload?.uid);
        this.games = this.games.filter(game => game.serverSocketId !== socket.id);
        this.games = this.games.map(game =>
            game.clientSocketId === socket.id ? { ...game, clientSocketId: null, clientUid: null } : game,
        );

        console.log('handleDisconnect (socket.id)::::= ', socket.id);
        // Notify connected clients of current users
        this.server.emit('get-games', { data: this.games });
        this.server.emit('client-connecting', { occasion: 'client_disconnected', decode, users: this.users });
    }
}
