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
} from '@nestjs/websockets';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { Bind, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';
import {WsJwtGuard} from "../../guards/ws-jwt.guard";
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer()
    server: Server;
    users = 0;

    private logger = new Logger('ChatGateway');

    constructor(private chatService: ChatService) {}

    @Bind(MessageBody(), ConnectedSocket())
    @SubscribeMessage('add-chat')
    addChat(data: any, sender: any){

      return { event: 'add-chat', data: data };
    }

    @Bind(MessageBody(), ConnectedSocket())
    @SubscribeMessage('events')
    handle(data: any, sender: any): Observable<WsResponse<number>> | any {
        // @ts-ignore
        // return of(data) as Observable;
        // return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
        // console.log(111, data, sender)
        // return from([data]).pipe(map(item => ({ event: 'events', data: item })));
        this.server.emit('events', { data, id: sender.id });
        // return { event: 'events', data: data };
    }

    // @Bind(MessageBody(), ConnectedSocket())
    // @UseGuards(WsJwtGuard)
    // @UseGuards(JwtAuthGuard)
    @SubscribeMessage('test1')
    handleTest(@MessageBody() data: any, @ConnectedSocket() sender: any): any {
        console.log('test___', data, sender.id);
        // return of({ event: 'test1', data });
        // return from([1, 2, 3]).pipe(map(item => ({ event: 'test1', data: item })));
        // return { event: 'test1', data: { data, id: sender.id, users: this.users } };
        this.server.emit('test1', { data, id: sender.id, users: this.users });
    }

    async afterInit() {
        console.log('init ws');
    }

    async handleConnection(data: Socket) {
        // A client has connected
        // console.log(data.client);
        this.logger.log('New client connected');
        this.users++;

        // Notify connected clients of current users
        this.server.emit('users', this.users);
    }

    async handleDisconnect() {
        // A client has disconnected
        this.logger.log('Client disconnected');
        this.users--;

        // Notify connected clients of current users
        this.server.emit('users', this.users);
    }
}
