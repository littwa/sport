import { Injectable } from "@nestjs/common";
import { Customer, CustomerDocument } from "../customers/customers.schema";
import {Chat, ChatDocument} from "./chat.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class ChatService {
    constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {
    }
}
