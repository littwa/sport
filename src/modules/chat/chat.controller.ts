import { Controller, Get, HttpCode, HttpStatus, UseGuards, UsePipes, ValidationPipe, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Roles } from '../../authorization/roles.decorator';
import { ERole } from '../../shared/enums/role.enum';
import { ChatService } from './chat.service';
import {SocketService} from "../../shared/services/socket.service";

@ApiTags('chat')
@Controller('chat')
export class ChatController {
    constructor(private socketService: SocketService) {}

    // Not to used, instead applies access token
    @ApiOperation({ summary: 'Get WS Ticket' })
    @ApiResponse({ status: 200, description: 'Return WS Ticket.' })
    @ApiResponse({ status: 404, description: 'Can not get WS Ticket.' })
    @ApiBearerAuth()
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @HttpCode(HttpStatus.OK)
    @Get('get-ticket')
    @UseGuards(JwtAuthGuard)
    getWsTicket(@Request() req) {
        //  @Body() body
        // console.log('req.user-', req.user);
        return this.socketService.createWsTicket(req.user);
    }
}
