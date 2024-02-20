import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/modules/users/users.service';
import {User, UserDocument} from "../../modules/users/user.schema";
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SocketService {
    private ticketToken = 'jwtExpires._60Seconds';

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,private jwtService: JwtService, private usersService: UsersService, private configService: ConfigService) {}

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

    async checkUserFromSocket(socket: Socket) {
        const { authorization } = socket.handshake.headers;

        let result: { [key: string]: any };

        try {
            result = await this.usersService.verifyToken(authorization);
        } catch (err) {
            result = {
                error: 'unauthorized',
                message: 'expired jwt token',
                status: 401,
            };
        }

        // UnauthorizedException
        // console.log(88888888888888888, result)
        // if (!user) {
        //     throw new WsException('Invalid credentials.');
        // }
        return result;
    }

}
