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
    Query,
    Req,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { Roles } from 'src/authorization/roles.decorator';
import { ERole } from 'src/shared/enums/role.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { IRequestExt } from 'src/shared/interfaces/auth.interfaces';
import { CodeService } from 'src/modules/code/code.service';
import { CreateCodeDto } from './dto/code.dto';
import { ICodeGetQuery, IGetCodeTagsParams, IGetCodeTypeParams } from '../../shared/interfaces/code.interfaces';

@Controller('code')
export class CodeController {
    constructor(private codeService: CodeService) {}

    @ApiOperation({ summary: 'Create code' })
    @ApiResponse({ status: 201, description: 'Return created code' })
    @ApiResponse({ status: 404, description: 'Can not create code' })
    @ApiBearerAuth()
    @Post('')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseInterceptors(AnyFilesInterceptor())
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() body: CreateCodeDto,
        @Req() req: IRequestExt,
    ) {
        return await this.codeService.createCode(files, body, req);
    }

    @ApiOperation({ summary: 'Del code' })
    @ApiResponse({ status: 204, description: 'Return Del code' })
    @ApiResponse({ status: 404, description: 'Can not Del code' })
    @ApiBearerAuth()
    @Delete(':id')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async del(@Param() param: any) {
        await this.codeService.delCode(param.id);
    }

    @ApiOperation({ summary: 'Update code' })
    @ApiResponse({ status: 201, description: 'Return Updated code' })
    @ApiResponse({ status: 404, description: 'Can not Update code' })
    @ApiBearerAuth()
    @Patch(':id')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AnyFilesInterceptor())
    @HttpCode(HttpStatus.CREATED)
    async update(@Body() body: any, @UploadedFiles() files: Array<Express.Multer.File>, @Param() param: any) {
        return this.codeService.updateCode(param.id, files[0], body);
    }

    @ApiOperation({ summary: 'Get codes' })
    @ApiResponse({ status: 200, description: 'Return codes' })
    @ApiResponse({ status: 404, description: 'Can not codes' })
    @ApiBearerAuth()
    @Get('')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async get(@Req() req: IRequestExt, @Query() query: ICodeGetQuery) {
        console.log(query);
        return this.codeService.getCodes(query, req);
    }

    @ApiOperation({ summary: 'Get types' })
    @ApiResponse({ status: 200, description: 'Return types' })
    @ApiResponse({ status: 404, description: 'Can not types' })
    @ApiBearerAuth()
    @Get('types{/:name}')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async findTypes(@Req() req: IRequestExt, @Param() params: IGetCodeTypeParams) {
        return this.codeService.findCodeTypes(params, req);
    }

    @ApiOperation({ summary: 'Get tags' })
    @ApiResponse({ status: 200, description: 'Return tags' })
    @ApiResponse({ status: 404, description: 'Can not tags' })
    @ApiBearerAuth()
    @Get('tags{/:name}')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async findTags(@Req() req: IRequestExt, @Param() params: IGetCodeTagsParams) {
        return this.codeService.findCodeTags(params, req);
    }

    @ApiOperation({ summary: 'Get all tags' })
    @ApiResponse({ status: 200, description: 'Return all tags' })
    @ApiResponse({ status: 404, description: 'Can not all tags' })
    @ApiBearerAuth()
    @Get('tags-all')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getAllTags() {
        return this.codeService.getAllCodeTags();
    }
}
