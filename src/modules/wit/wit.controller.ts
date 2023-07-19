import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    Patch,
    Post,
    Put,
    Query,
    Req,
    Response,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { WitService } from './wit.service';
import { Roles } from '../../authorization/roles.decorator';
import { ERole } from '../../shared/enums/role.enum';
import { CreateProductDto } from '../products/dto/product.dto';
import {
    CreatePhraseDto,
    CreateWitItemDto,
    ParamIdPhraseDto,
    ParamIdWitDelDto,
    ParamIdWitDto,
    UpdatePhraseDto,
} from './dto/wit.dto';

@ApiTags('wit')
@Controller('wit')
export class WitController {
    constructor(private witService: WitService) {}

    @ApiOperation({ summary: 'Create list' })
    @ApiResponse({ status: 201, description: 'Return created list.' })
    @ApiResponse({ status: 404, description: 'Can not create list.' })
    @ApiBearerAuth()
    @Post('add-list')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.CREATED)
    addList(@Body() body: CreateWitItemDto, @Req() req) {
        console.log(body);
        return this.witService.addList(body, req);
    }

    @ApiOperation({ summary: 'Create phrase and add to list' })
    @ApiResponse({ status: 201, description: 'Return created phrase and add to list.' })
    @ApiResponse({ status: 404, description: 'Can not create phrase and add to list.' })
    @ApiBearerAuth()
    @Post('add-phrase-list/:listId')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.CREATED)
    addPhraseToList(@Body() body: CreatePhraseDto, @Param() param: ParamIdWitDto, @Req() req) {
        console.log(body);
        return this.witService.createAndAddPhraseToList(body, param.listId);
    }

    @ApiOperation({ summary: 'Del phrase from list' })
    @ApiResponse({ status: 204, description: 'Return Del phrase from list.' })
    @ApiResponse({ status: 404, description: 'Can not Del phrase from list.' })
    @ApiBearerAuth()
    @Delete('del-phrase-list/:listId/:phraseId')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.NO_CONTENT)
    delPhraseFromList(@Param() param: ParamIdWitDelDto, @Req() req) {
        return this.witService.delPhraseFromList(param.phraseId, param.listId);
    }

    @ApiOperation({ summary: 'Del phrase permanently.' })
    @ApiResponse({ status: 204, description: 'Return Del phrase permanently.' })
    @ApiResponse({ status: 404, description: 'Can not Del phrase permanently.' })
    @ApiBearerAuth()
    @Delete('del-phrase-permanently/:listId/:phraseId')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.NO_CONTENT)
    delPhrasePermanently(@Param() param: ParamIdWitDelDto, @Req() req) {
        this.witService.delPhrasePermanently(param.phraseId, param.listId);
    }

    @ApiOperation({ summary: 'Del list permanently.' })
    @ApiResponse({ status: 204, description: 'Return Del list permanently.' })
    @ApiResponse({ status: 404, description: 'Can not Del list permanently.' })
    @ApiBearerAuth()
    @Delete('del-list-permanently/:listId')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.NO_CONTENT)
    delListPermanently(@Param() param: ParamIdWitDto, @Req() req) {
        this.witService.delListPermanently(param.listId);
    }

    @ApiOperation({ summary: 'Update phrase' })
    @ApiResponse({ status: 201, description: 'Return Updated phrase.' })
    @ApiResponse({ status: 404, description: 'Can not Update phrase.' })
    @ApiBearerAuth()
    @Patch('update-phrase/:phraseId')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.CREATED)
    updatePhrase(@Body() body: UpdatePhraseDto, @Param() param: ParamIdPhraseDto, @Req() req) {
        return this.witService.updatePhrase(param.phraseId, body);
    }

    @ApiOperation({ summary: 'Get user lists' })
    @ApiResponse({ status: 200, description: 'Return user lists.' })
    @ApiResponse({ status: 404, description: 'Can not user lists.' })
    @ApiBearerAuth()
    @Get('get-lists')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    getLists(@Req() req) {
        return this.witService.getLists(req);
    }

    @ApiOperation({ summary: 'Get user list aggregation phrases' })
    @ApiResponse({ status: 200, description: 'Return user list aggregation phrases.' })
    @ApiResponse({ status: 404, description: 'Can not user list aggregation phrases.' })
    @ApiBearerAuth()
    @Get('get-list/:listId')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    getListAggregate(@Req() req, @Param() param: ParamIdWitDto) {
        return this.witService.getListAggregate(param.listId, req);
    }

    @ApiOperation({ summary: 'test' })
    @ApiResponse({ status: 200, description: 'test.' })
    @ApiResponse({ status: 404, description: 'test.' })
    // @ApiBearerAuth()
    @Post('test')
    // @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    // @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.CREATED)
    test(@Body() body: any) {
        // CreateWitItemDto
        console.log(body);
        return this.witService.executeAux1(body);
    }
}
