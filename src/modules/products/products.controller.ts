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
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../authorization/roles.decorator';
import { ERole } from '../../shared/enums/role.enum';
import { IPagination } from '../../shared/interfaces/common.interfaces';
import { PostGetParamDto } from '../posts/dto/posts.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(@Inject('ProductsServiceToken') private productsService: ProductsService) {}

    @ApiOperation({ summary: 'Get products' })
    @ApiResponse({ status: 200, description: 'Return products.' })
    @ApiResponse({ status: 404, description: 'Can not get products.' })
    @ApiBearerAuth()
    @Get(':category?')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    getProducts(@Query() query: any, @Param() param: any, @Req() req: any) {
        return this.productsService.getProducts(query, param, req);
    }

    @Get(':productId')
    @HttpCode(HttpStatus.OK)
    getProductById(@Param() param) {
        return this.productsService.getProductById(param.productId);
    }

    @ApiOperation({ summary: 'Create product' })
    @ApiResponse({ status: 200, description: 'Return created product.' })
    @ApiResponse({ status: 404, description: 'Can not create product.' })
    @ApiBearerAuth()
    @Post('add')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.CREATED)
    addProduct(@Body() body) {
        return this.productsService.addProduct(body);
    }

    @Patch('update/:productId')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    updateProduct(@Body() body, @Param() param) {
        return this.productsService.updateProduct(body, param.productId);
    }

    @Delete('del/:productId')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.NO_CONTENT)
    delProduct(@Param() param) {
        return this.productsService.deleteProduct(param.productId);
    }

    @Patch('rate/:productId')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    rateProduct(@Body() body, @Param() param) {
        return this.productsService.giveRatingProduct(body, param.productId);
    }

    @Get('test')
    @HttpCode(HttpStatus.OK)
    testProducts() {
        return { testProducts: true };
    }

    // @Put('update/:productId')
    // @HttpCode(HttpStatus.OK)
    // updateProductPut(@Body() body, @Param() param) {
    //   return this.productsService.updateProduct(body, param.productId);
    // }
}
