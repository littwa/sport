import {EChatType} from "../enums/chat.enum";

export interface IChat {
    _id: string;
    author: string;
    created: string; // "2023-11-01T21:21:33.833Z"
    data: any;
    messages: any;
    name: string;
    private: boolean;
    privateUsersList: any[];
    usersList: any[];
    type: EChatType;
}

export interface IChatData {
    info: string;
    [key: string]: any;
}
