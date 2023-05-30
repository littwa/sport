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
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { IDelReviewParams, IGetProdParam } from '../../shared/interfaces/products.interfaces';
import { CreateCommentDto } from '../comments/dto/comments.dto';

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
    getProducts(@Req() req: any, @Query() query: any, @Param() param: IGetProdParam) {
        return this.productsService.getProducts(req, query, param);
    }

    @ApiOperation({ summary: 'Get product by Id' })
    @ApiResponse({ status: 200, description: 'Return product by Id.' })
    @ApiResponse({ status: 404, description: 'Can not product by Id.' })
    @ApiBearerAuth()
    @Get(':productId')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(AuthGuard('jwt'))
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
    addProduct(@Body() body: CreateProductDto) {
        console.log(body);
        return this.productsService.addProduct(body);
    }

    @ApiOperation({ summary: 'Update product' })
    @ApiResponse({ status: 200, description: 'Return updated product.' })
    @ApiResponse({ status: 404, description: 'Can not updated product.' })
    @ApiBearerAuth()
    @Patch('update/:productId')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    updateProduct(@Body() body: UpdateProductDto, @Param() param) {
        return this.productsService.updateProduct(body, param.productId);
    }

    @ApiOperation({ summary: 'Del product' })
    @ApiResponse({ status: 204, description: 'No content' })
    @ApiResponse({ status: 404, description: 'Can not updated product.' })
    @ApiBearerAuth()
    @Delete('del/:productId')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.NO_CONTENT)
    delProduct(@Param() param) {
        return this.productsService.deleteProduct(param.productId);
    }

    @ApiOperation({ summary: 'Update product rate' })
    @ApiResponse({ status: 200, description: 'Return updated rate product.' })
    @ApiResponse({ status: 404, description: 'Can not updated rate product.' })
    @ApiBearerAuth()
    @Patch('rate/:productId')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    rateProduct(@Body() body, @Param() param) {
        return this.productsService.giveRatingProduct(body, param.productId);
    }

    @ApiOperation({ summary: 'Add review(comment) to product ' })
    @ApiResponse({ status: 200, description: 'Return review(comment).' })
    @ApiResponse({ status: 404, description: 'Can not add review(comment) to product.' })
    @ApiBearerAuth()
    @Patch('add-review/:productId')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    addReviewProduct(@Body() body: CreateCommentDto, @Param() param, @Req() req) {
        return this.productsService.addReviewProduct(body, param.productId, req);
    }

    @ApiOperation({ summary: 'Delete review(comment) to product ' })
    @ApiResponse({ status: 204, description: 'review was Delete.' })
    @ApiResponse({ status: 404, description: 'Can not del review(comment) to product.' })
    @ApiBearerAuth()
    @Delete('del-review/:productId/:commentId')
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.NO_CONTENT)
    delReviewProduct(@Param() params: IDelReviewParams, @Req() req) {
        console.log(100009, params);
        return this.productsService.delReviewProduct(params);
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
