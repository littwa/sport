import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(WsException, HttpException)
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
    catch(exception: WsException | HttpException, host: ArgumentsHost) {

        // const args = host.getArgs();
        // const ws: WsArgumentsHost = host.switchToWs()
        // const client = ws.getClient<any>();

        // console.log('exception::: ', exception);
        // console.log('host::: ', host);
        // console.log('args::: ', args);
        // console.log('clientWs.server::: ', client.server);
        // console.log(exception.name, exception.message, exception.initMessage(), exception.stack)

        // client.server.emit('exception', exception);

        console.log('exception::: ', exception);
        super.catch(exception, host);
    }
}
