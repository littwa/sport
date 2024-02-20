import { Injectable } from "@nestjs/common";
import { Server, Socket } from 'socket.io';
import {SocketService} from "../../shared/services/socket.service";

@Injectable()
export class BattleshipsService {
    constructor(public socketService: SocketService) {}

    async addGame(data: any, sender: Socket) {
        // const result = await this.socketService.checkUserFromSocket(sender);
        return Promise.resolve(undefined);
    }
}
