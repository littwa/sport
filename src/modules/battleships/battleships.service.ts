import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SocketService } from 'src/shared/services/socket.service';
import { Battleships, BattleshipsDocument } from 'src/modules/battleships/battleships.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {IBattleshipsGame, IBattleshipsStep} from 'src/shared/interfaces/battleships.interfaces';
import { EBattleshipsStage, EBattleshipsType } from 'src/shared/enums/battleships.enum';
import { WsException } from '@nestjs/websockets';
import { INIT_BATTLESHIPS_STATE } from "../../shared/constants/battleships.constants";


@Injectable()
export class BattleshipsService {
    constructor(
        public socketService: SocketService,
        @InjectModel(Battleships.name) private battleshipsModel: Model<BattleshipsDocument>,
    ) {}

    async createGame(data: IBattleshipsGame, sender: Socket): Promise<Battleships> {
        const game = await this.battleshipsModel.create({
            server: data.serverUid,
            client: data.clientUid,
            room: data.roomName,
            created: data.timestamp,
            type: EBattleshipsType.Multiplayer,
            state: {
                server: INIT_BATTLESHIPS_STATE, // 'q4_3_0_1'
                client: INIT_BATTLESHIPS_STATE,
                stage: EBattleshipsStage.Deployment,
                isServerStep: true,
            },
        });

        return game.populate(['server', 'client']);
    }

    async execute(data: IBattleshipsStep, socket: Socket): Promise<Battleships> {
         const game = await this.battleshipsModel.findByIdAndUpdate(data.id).exec();
         if(!game){
             throw new WsException('Game not found');
         }
         if(data.step){
         //
         }

         return game.populate(['server', 'client']);
        // let game = await this.battleshipsModel.findByIdAndUpdate(id).exec();
        // const gamePopulated = await game.populate(['tags', 'type']);
    }
}
