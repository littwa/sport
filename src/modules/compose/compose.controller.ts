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
    UploadedFiles,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../authorization/roles.decorator';
import { ERole } from '../../shared/enums/role.enum';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ComposeService } from './compose.service';
import {
    CreateComposeDto,
    CreateComposeListDto,
    ParamIdComposeDelDto,
    ParamIdComposeDto,
    UpdateComposeDto,
} from './dto/compose.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@ApiTags('compose')
@Controller('compose')
export class ComposeController {
    constructor(private composeService: ComposeService) {}

    @ApiOperation({ summary: 'Create compose list' })
    @ApiResponse({ status: 201, description: 'Return created compose list.' })
    @ApiResponse({ status: 404, description: 'Can not create compose list.' })
    @ApiBearerAuth()
    @Post('add-compose-list')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async addComposeList(@Body() body: CreateComposeListDto, @Req() req) {
        return await this.composeService.addComposeList(body, req);
    }

    @ApiOperation({ summary: 'Del compose list' })
    @ApiResponse({ status: 204, description: 'Return del compose list.' })
    @ApiResponse({ status: 404, description: 'Can not del compose list.' })
    @ApiBearerAuth()
    @Delete('del-compose-list/:id')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async delListAndComposes(@Body() body: any, @Param() param: any) {
        return await this.composeService.delListAndComposes(param.id);
    }

    @ApiOperation({ summary: 'Create compose and add to list' })
    @ApiResponse({ status: 201, description: 'Return created compose and add to list.' })
    @ApiResponse({ status: 404, description: 'Can not create compose and add to list.' })
    @ApiBearerAuth()
    @Post('add-compose/:id')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseInterceptors(AnyFilesInterceptor())
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    createComposeAndAddToList(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body: CreateComposeDto, @Param() param: ParamIdComposeDto) {
        return this.composeService.createComposeAndAddToList(files[0], body, param.id);
    }

    @ApiOperation({ summary: 'Del compose from list' })
    @ApiResponse({ status: 204, description: 'Return Del compose from list.' })
    @ApiResponse({ status: 404, description: 'Can not Del compose from list.' })
    @ApiBearerAuth()
    @Delete('del-compose/:listId/:composeId')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async delPhraseFromList(@Param() param: ParamIdComposeDelDto) {
        await this.composeService.delComposePermanently(param.composeId, param.listId);
    }

    @ApiOperation({ summary: 'Update compose' })
    @ApiResponse({ status: 201, description: 'Return Updated compose.' })
    @ApiResponse({ status: 404, description: 'Can not Update compose.' })
    @ApiBearerAuth()
    @Patch('update-compose/:id')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AnyFilesInterceptor())
    @HttpCode(HttpStatus.CREATED)
    updateCompose(@Body() body: UpdateComposeDto,@UploadedFiles() files: Array<Express.Multer.File>, @Param() param: ParamIdComposeDto) {
        return this.composeService.updateCompose(param.id, files[0], body);
    }

    @ApiOperation({ summary: 'Get compose lists' })
    @ApiResponse({ status: 200, description: 'Return compose lists.' })
    @ApiResponse({ status: 404, description: 'Can not compose lists.' })
    @ApiBearerAuth()
    @Get('get-lists')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    getComposeLists(@Req() req: any) {
        return this.composeService.getComposeLists(req);
    }

    @ApiOperation({ summary: 'Get user compose list aggregate' })
    @ApiResponse({ status: 200, description: 'Return user list aggregate.' })
    @ApiResponse({ status: 404, description: 'Can not user list aggregate.' })
    @ApiBearerAuth()
    @Get('get-list/:id')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    getListAggregate(@Param() param: ParamIdComposeDto) {
        return this.composeService.getComposeListAggregate(param.id);
    }
}
