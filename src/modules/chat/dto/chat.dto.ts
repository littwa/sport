
import {ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {EChatType} from "../../../shared/enums/chat.enum";
import {IsIn, IsObject, IsOptional, IsString } from "class-validator";
import {IChatData} from "../../../shared/interfaces/chat.interfaces";

export class CreateChatDto {

    @ApiProperty()
    @IsString()
    name: string;

    @IsString()
    @ApiProperty({ enum: EChatType, enumName: 'EChatType' })
    @IsIn([EChatType.Extraordinary, EChatType.Auto, EChatType.Business, EChatType.Funny, EChatType.Military])
    type: EChatType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsObject()
    data?: IChatData;
}
