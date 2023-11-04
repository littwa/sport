import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import {UsersService} from "../modules/users/users.service";

@Injectable()
export class WsAuthInterceptor implements NestInterceptor {
    constructor(private usersService: UsersService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        try {
            const client: Socket = context.switchToWs().getClient<Socket>();
            const decode = this.usersService.decodeAnyToken(client.handshake.headers.authorization);
            client.data.decode = decode;
            console.log('decode::::  ', decode)
        } catch (err) {
            // throw new WsException(err.message);
        }

        return next.handle();
    }
}
