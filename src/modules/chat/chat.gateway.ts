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
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {BadRequestException, Bind, Req, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';
import { WsJwtGuard } from "../../guards/ws-jwt.guard";
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from "../users/users.service";
import { WebsocketExceptionsFilter} from "../../filters/ws.exception.filter";
import {CreateChatDto} from "./dto/chat.dto";
import {WsAuthInterceptor} from "../../interceptors/ws-auth.interceptor";

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
@UseInterceptors(WsAuthInterceptor)
@UseFilters(WebsocketExceptionsFilter)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer()
    server: Server;
    users = [];

    constructor(private chatService: ChatService, private usersService: UsersService) {}

    @Bind(MessageBody(), ConnectedSocket())
    @SubscribeMessage('add-chat')
    async addChat(data: CreateChatDto, sender: Socket){
        return await this.chatService.addChat(data, sender);
        // this.server.emit('add-chat', data);
        // return { event: 'add-chat', data };
    }

    @Bind(MessageBody(), ConnectedSocket())
    @SubscribeMessage('get-chats')
    async handle(data: any, sender: Socket) {
        // @ts-ignore
        // return of(data) as Observable;
        // return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
        // console.log(111, data, sender)
        // return from([data]).pipe(map(item => ({ event: 'events', data: item })));
        const chats = await this.chatService.getAllChats();
        // console.log(chats)
        // this.server.emit('events', { data, id: sender.id });
        return { event: 'get-chats', data: chats };
    }

    @Bind(MessageBody(), ConnectedSocket())
    @SubscribeMessage('join-chat')
    async joinChat(chat: any, socket: Socket) {
        // console.log('socket.id:: ', socket.id);
        // console.log('sever: ', this.server);
        this.server.in(socket.id).socketsJoin(chat._id);
        const data =  this.chatService.joinChat(chat, socket);
        // console.log('socket.rooms:: ', socket.rooms);
        // console.log('sever.sockets: ', this.server.sockets);
        //console.log('sever rooms: ', this.server.sockets.adapter.rooms);
        return { event: 'join-chat', data };
    }

    @Bind(MessageBody(), ConnectedSocket())
    @SubscribeMessage('leave-chat')
    async leaveChat(chat: any, socket: Socket) {
        this.server.in(socket.id).socketsLeave(chat._id);
        const data = this.chatService.leaveChat(chat, socket);
        return { event: 'leave-chat', data };
    }

    // @Bind(MessageBody(), ConnectedSocket())
    // @UseGuards(WsJwtGuard)
    @SubscribeMessage('addition_message')
    async handleAddMessage(@MessageBody() data: any, @ConnectedSocket() sender: Socket) {
        // this.server.in()
        const res = await this.chatService.addMessage(data, sender)
        console.log(11111, res.data);
        this.server.to(data.chat).emit('addition_message', res.data);
        // sender.broadcast
        // return res;
    }

    async afterInit(data: Socket) {
        console.log('init websockets');
    }

    async handleConnection(socket: Socket) {
       const result = await this.chatService.checkUserFromSocket(socket);
       // console.log('result:::::::: ', result);
       if(result.uid){
           this.users.push(result.uid);
       }

       if(!result.uid){
           this.server.emit('exception', result)
       }


        this.server.emit('client-connecting', { occasion: 'client_disconnected', result, users: this.users });

    }

    async handleDisconnect(socket: Socket) {
        const { authorization } = socket.handshake.headers;
        const decode = (this.usersService.decodeAnyToken(authorization) as any);

        // console.log('handleConnection (decode):::: ', decode);

        // A client has disconnected
        // this.logger.log('Client disconnected');
        this.users = this.users.filter(uid => uid !== decode?.payload?.uid);
        await this.chatService.removeUserFromAllChats(socket);


        // Notify connected clients of current users
        this.server.emit('client-connecting', { occasion: 'client_disconnected', decode, users: this.users });
    }
}
