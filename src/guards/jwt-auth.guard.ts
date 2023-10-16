import {ExecutionContext, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    handleRequest(err: any, user: any, info: any, context: any, status: any) {
        console.log('handleRequest===');
        // if (err || !user) {
        //
        //     throw new HttpException(err.message, err.status);
        // }
        return user;
    }

}
