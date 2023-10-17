import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {

    catch(exception: any, host: ArgumentsHost) {
        let { message, stack, name } = exception;
        console.log('HttpExceptionFilter==============exception name:: ', name, message, exception)
        console.log('exception--', exception)
        if(name === 'TokenExpiredError'){
            const ctx = host.switchToHttp();
            const response = ctx.getResponse<Response>();
            const request = ctx.getRequest<Request>();
            const status = 401;

            // console.log('request', request)

            response
                .status(status)
                .json({
                    statusCode: status,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    message,
                    name
                });
        } else {
            super.catch(exception, host);
        }
    }

}
