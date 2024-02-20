import { EBattleshipsStage } from 'src/shared/enums/battleships.enum';

export interface IBattleshipsData {
    info: string;
    [key: string]: any;
}

export interface IBattleshipsState {
    server: any;
    client: any;
    stage: EBattleshipsStage;
}

export interface IBattleshipsGame {
    serverUid: string,
    serverSocketId: string,
    clientUid: string,
    clientSocketId: string,
    timestamp: any,
    roomName: string,
    params: any,
}
