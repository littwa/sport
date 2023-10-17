import { Controller, Get, HttpCode, HttpStatus, UseGuards, UsePipes, ValidationPipe, Request } from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {JwtAuthGuard} from "../../guards/jwt-auth.guard";
import {Roles} from "../../authorization/roles.decorator";
import {ERole} from "../../shared/enums/role.enum";
import {ChatService} from "./chat.service";

@ApiTags('chat')
@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) {
    }

    @ApiOperation({ summary: 'Get products' })
    @ApiResponse({ status: 200, description: 'Return products.' })
    @ApiResponse({ status: 404, description: 'Can not get products.' })
    @ApiBearerAuth()
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @HttpCode(HttpStatus.OK)
    @Get('get-ticket')
    @UseGuards(JwtAuthGuard)
    getWsTicket(@Request() req) {
        console.log('req.user-', req.user);
        return this.chatService.createWsTicket(req.user);
    }
}
