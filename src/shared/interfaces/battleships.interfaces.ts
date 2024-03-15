import { EBattleshipsStage } from 'src/shared/enums/battleships.enum';

export interface IBattleshipsData {
    info: string;
    [key: string]: any;
}

export interface IBattleshipsState {
    server: any;
    client: any;
    stage: EBattleshipsStage;
    isServerStep: boolean
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

export interface IBattleshipsStep {
    id: string;
    step: IBattleshipsState
}
