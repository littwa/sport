import { BadRequestException, Injectable } from '@nestjs/common';
import { Chat, ChatDocument } from './chat.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatService {
    private ticketToken = 'jwtExpires._60Seconds';

    constructor(
        @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async createWsTicket({ _id }) {
        const user = await this.userModel.findOne(
            {
                _id,
            },
            { password: 0 },
        );
        if (!user) throw new BadRequestException('User was not found');

        const token = this.jwtService.sign(
            {
                uid: user._id,
                secret: process.env.TOKEN_SECRET,
                email: user.email,
                role: user.role,
            },
            { expiresIn: this.configService.get(this.ticketToken).exp },
        );

        return { token };
    }
}
