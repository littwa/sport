import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { Roles } from 'src/authorization/roles.decorator';
import { ERole } from 'src/shared/enums/role.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JournalService } from 'src/modules/journal/journal.service';
import { IRequestExt } from 'src/shared/interfaces/auth.interfaces';
import { CreateEntryDto, GetMonthEntryDto, UpdateEntryDto } from 'src/modules/journal/dto/journal.dto';

@Controller('journal')
export class JournalController {
    constructor(private journalService: JournalService) {}

    @ApiOperation({ summary: 'Create entry' })
    @ApiResponse({ status: 201, description: 'Return created entry.' })
    @ApiResponse({ status: 404, description: 'Can not create entry.' })
    @ApiBearerAuth()
    @Post('')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async add(@Body() body: CreateEntryDto, @Req() req: IRequestExt) {
        return await this.journalService.add(body, req);
    }

    @ApiOperation({ summary: 'Update entry' })
    @ApiResponse({ status: 201, description: 'Return update entry.' })
    @ApiResponse({ status: 404, description: 'Can not update entry.' })
    @ApiBearerAuth()
    @Patch(':id')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async update(@Body() body: UpdateEntryDto, @Req() req: IRequestExt, @Param() param) {
        return await this.journalService.update(body, param.id, req);
    }

    @ApiOperation({ summary: 'Delete entry' })
    @ApiResponse({ status: 204, description: 'Return delete entry.' })
    @ApiResponse({ status: 404, description: 'Can not delete entry.' })
    @ApiBearerAuth()
    @Delete(':id')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Req() req: IRequestExt, @Param() param) {
        return await this.journalService.delete(param.id);
    }

    @ApiOperation({ summary: 'Get month entry' })
    @ApiResponse({ status: 201, description: 'Return month entry.' })
    @ApiResponse({ status: 404, description: 'Can not get month entry.' })
    @ApiBearerAuth()
    @Get(':month/:year')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async getMonthEntry(@Param() param: GetMonthEntryDto, @Req() req: IRequestExt) {
        return await this.journalService.getMonthEntry(param.month, param.year, req);
    }
}
