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
import { CreateWitItemDto } from './dto/wit.dto';

@ApiTags('wit')
@Controller('wit')
export class WitController {
    constructor(private witService: WitService) {}

    @ApiOperation({ summary: 'Create item' })
    @ApiResponse({ status: 200, description: 'Return created item.' })
    @ApiResponse({ status: 404, description: 'Can not create item.' })
    @ApiBearerAuth()
    @Post('add')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.CREATED)
    addProduct(@Body() body: any) {
        // CreateWitItemDto
        console.log(body);
        return this.witService.addItem(body);
    }
}
