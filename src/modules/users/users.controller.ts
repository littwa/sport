import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Header,
    HttpCode,
    HttpStatus,
    Next,
    Param,
    Patch,
    Post,
    Put,
    Redirect,
    Req,
    Res,
    UseGuards,
    Request,
    Query,
    UnauthorizedException,
    Headers,
    Inject,
    UseInterceptors,
    UploadedFile,
    UploadedFiles,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { NextFunction, Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { ERole } from 'src/shared/enums/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../authorization/roles.decorator';
import { RolesGuard } from '../../authorization/roles.guard';
import * as passport from 'passport';
import { ProductsModule } from '../products/products.module';
import { ProductsService } from '../products/products.service';
import { AnyFilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import { storage } from 'src/config/config-entity';
import * as sharp from 'sharp';
import { CommonService } from '../../shared/services/common.service';
import {
    CartProductUserParamDto,
    UserCustomerCreateDto,
    UserFollowBodyDto,
    UsersFindDto,
    UsersFindDtoExtends,
    UserUpdateDto,
} from './dto/user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParamIdDto } from '../../shared/dto/common.dto';
import {JwtAuthGuard} from "../../guards/jwt-auth.guard";
// import { ConfigServiceTest } from '../app.module';

// const storage = multer.diskStorage({
//   destination: 'uploads',
//   // destination: function (req, file, cb) {
//   //   cb(null, 'uploads');
//   // },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now();
//     const ext = path.parse(file.originalname).ext;
//     cb(null, uniqueSuffix + ext);
//   },
// });

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(
        private commonService: CommonService,
        private readonly userService: UsersService,
        @Inject('ProductsServiceToken') private productsService: ProductsService, // private readonly uf: // private tc: ConfigServiceTest,
    ) {}

    @Post('post-test')
    @UseInterceptors(AnyFilesInterceptor())
    async getTest(
        @Body() body: UserUpdateDto,
        @Param() param,
        @Query() query,
        @UploadedFiles() files: Array<Express.Multer.File>,
    ) {
        // const service = await this.userService.test(body, param, query, files[0])
        // const service = await this.commonService.imgbbHost(files[0]);
        // const service = await this.commonService.cloudinaryHost(files[0]);
        const service = this.userService.decodeAnyToken('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiI2NTM1MTkwZjgwNDFmYjk5MWJhNmE0YWUiLCJ1aWQiOiI2MmRlYzg4NWNjMWE1YTgwMjc4MzYzMzAiLCJzZWNyZXQiOiJzd29yZGZpc2giLCJlbWFpbCI6ImRldmFjY0BtZXRhLnVhIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjk3OTc4NjM5LCJleHAiOjE2OTc5ODIyMzl9.ujVhZbemDNOLE3h9PF8RwUjYZHMCttNU6Vn_lMcgidA');
        return {
            service,
            // files: this.commonService.multerFactory(files),
            // req: req,
            // BASE_URL_API: process.env.BASE_URL_API,
            // GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
            // BASE_URL_API_FULL: process.env.BASE_URL_API_FULL,
            // BASE_URL_FRONT_END: process.env.BASE_URL_FRONT_END,
            // TOKEN_SECRET: process.env.TOKEN_SECRET,
            // processCwd: process.cwd(),
            // dirname__: __dirname,
        };
    }

    // Google-auth
    // @Get('google-auth')
    // @UseGuards(AuthGuard('google'))
    // async googleAuth() {
    //   console.log(1999999999);
    // } // here will be redirect

    @Get('google-auth/redirect')
    @UseGuards(AuthGuard('google'))
    @Redirect() // 'http://localhost:4200/choicse-customer'  // google-auth/return
    async googleAuthRedirect(@Req() req, @Res() res, @Body() body, @Headers() headers, @Query() q) {
        const dto = await this.userService.googleLogin(req);
        const qString = Object.entries(dto).reduce((acc, el, i, arr) => {
            acc = acc + el[0].toString() + '=' + el[1].toString();
            if (arr.length - 1 !== i) acc = acc + '&';
            return acc;
        }, '');

        // return {
        //   url: `${process.env.BASE_URL_FRONT_END}?${qString}`,
        // }
        console.log(78);
        return res.redirect(`${process.env.BASE_URL_FRONT_END}?${qString}`);
    }

    @ApiOperation({ summary: 'Create User' })
    @ApiResponse({ status: 200, description: 'Return ...' })
    @ApiResponse({ status: 404, description: 'Can not ...' })
    @Post('sign-up')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @HttpCode(HttpStatus.CREATED)
    postSignUpUser(@Body() body: UserCustomerCreateDto) {
        console.log(100001, body);
        switch (body.role) {
            // case ERole.Admin:
            //   return this.userService.createUserAdmin(body);
            case ERole.Customer:
                return this.userService.createUserCustomer(body);
            default:
                return new BadRequestException('unknown role');
        }
    }

    @ApiOperation({ summary: 'Sign out' })
    @ApiResponse({ status: 200, description: 'Sign out success.' })
    @ApiResponse({ status: 404, description: 'Sign out error.' })
    @ApiBearerAuth()
    @Get('sign-out')
    @UseGuards(JwtAuthGuard)
    @Roles([ERole.Admin, ERole.Customer])
    signOut(@Request() req) {
        return this.userService.signOutUser(req.user);
    }

    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: 200, description: 'Return updated user.' })
    @ApiResponse({ status: 404, description: 'Can not update user.' })
    @ApiBearerAuth()
    @Patch('up-date/:id')
    @UseGuards(JwtAuthGuard)
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseInterceptors(AnyFilesInterceptor()) // { storage }
    @HttpCode(HttpStatus.OK)
    async updateUser(
        @Body() body: UserUpdateDto,
        @Param() param: ParamIdDto,
        @Query() query,
        @UploadedFiles() files: Array<Express.Multer.File> = [],
    ) {
        return await this.userService.updateUser(param, body, files[0]);
    }

    // @Get('admin/verify/:verificationCode')
    // @HttpCode(HttpStatus.OK)
    // getVerifycationUser(@Param() param): any {
    //   return this.userService.verifycationAdmin(param);
    // }
    //
    // @Get('customer/verify/:verificationCode')
    // @HttpCode(HttpStatus.OK)
    // verifycationCustomer(@Param() param): any {
    //   return this.userService.verifycationCustomer(param.verificationCode);
    // }

    @Get('get')
    @UseGuards(JwtAuthGuard)
    getCurrentUser(@Request() req) {
        // console.log('req.user-', req.user);
        return this.userService.getCurrentUser(req.user);
    }

    @Get('get/:userId')
    @UseGuards(JwtAuthGuard)
    getUserById(@Request() req, @Param() param) {
        // console.log('req.user-', req.user);
        return this.userService.getUserById(param.userId);
    }

    @Get('get-followers/:userId')
    @UseGuards(JwtAuthGuard)
    getUserFollowersById(@Request() req, @Param() param) {
        return this.userService.getUserFollowersById(param.userId);
    }

    @Get('get-following/:userId')
    @UseGuards(JwtAuthGuard)
    getUserFollowingById(@Request() req, @Param() param) {
        return this.userService.getUserFollowingById(param.userId);
    }

    @Get('get-aggregate')
    @UseGuards(JwtAuthGuard)
    getCurrentUserAggregate(@Request() req) {
        // console.log('req.user-', req.user);
        return this.userService.getCurrentUserAggregate(req.user);
    }

    @ApiOperation({ summary: 'Get users' })
    @ApiResponse({ status: 200, description: 'Return users.' })
    @ApiResponse({ status: 404, description: 'Can not users.' })
    @ApiBearerAuth()
    @Get('get-users{/:someName}')
    @UseGuards(JwtAuthGuard)
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @HttpCode(HttpStatus.OK)
    async getUsers(@Param() param: any, @Query() query: UsersFindDto, @Req() req) {
        return await this.userService.getUsers(param, query, req);
    }

    @ApiOperation({ summary: 'Get users extends' })
    @ApiResponse({ status: 200, description: 'Return users extends.' })
    @ApiResponse({ status: 404, description: 'Can not users extends.' })
    @ApiBearerAuth()
    @Get('get-users-ext')
    @UseGuards(JwtAuthGuard)
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @HttpCode(HttpStatus.OK)
    async getUsersExtends(@Query() query: UsersFindDtoExtends, @Req() req) {
        return await this.userService.getUsersExtends(query);
    }

    @Post('sign-in')
    signInCustomer(@Body() body) {
        return this.userService.signIn(body);
    }

    @Post('follow')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @HttpCode(HttpStatus.OK)
    follow(@Request() req, @Body() body: UserFollowBodyDto) {
        return this.userService.follow(req, body);
    }

    @Post('unfollow')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @HttpCode(HttpStatus.OK)
    unfollow(@Request() req, @Body() body: UserFollowBodyDto) {
        return this.userService.unfollow(req, body);
    }

    @Patch('add-favorite-product/:productId')
    @UseGuards(JwtAuthGuard)
    // @Roles(ERole.Admin)
    addFavoriteProduct(@Request() req, @Param() param) {
        return this.userService.addFavoriteProduct(param.productId, req);
    }

    @Patch('del-favorite-product/:productId')
    @UseGuards(JwtAuthGuard)
    // @Roles(ERole.Admin)
    delFavoriteProduct(@Request() req, @Param() param) {
        return this.userService.delFavoriteProduct(param.productId, req);
    }

    @Patch('add-cart-product/:productId/:amount')
    @UseGuards(JwtAuthGuard)
    // @Roles(ERole.Admin)
    addCartProduct(@Request() req, @Param() param: CartProductUserParamDto) {
        return this.userService.addCartProduct(param, req);
    }

    @Patch('del-cart-product/:productId/:amount')
    @UseGuards(JwtAuthGuard)
    // @Roles(ERole.Admin)
    delCartProduct(@Request() req, @Param() param: CartProductUserParamDto) {
        return this.userService.delCartProduct(param, req);
    }

    @Get('local')
    @UseGuards(AuthGuard('local'))
    testAuthGuardLocal(@Request() req) {
        return req.user;
    }

    @Get('get/user-customer-info')
    @UseGuards(JwtAuthGuard)
    // @Roles(ERole.Admin)
    getCustomer(@Request() req) {
        return this.userService.getInfoUserCustomer(req.user);
    }

    @Get('refresh')
    @UseGuards(JwtAuthGuard)
    getRefreshToken(@Req() req) {
        return this.userService.getRefreshToken(req);
    }

    @Get('test-jwt')
    @UseGuards(JwtAuthGuard)
    getCurrentUserTest(
        @Headers() headers,
        @Request() request,
        @Req() req,
        @Param() param,
        @Body() body,
        // @Res() res,
    ) {
        console.log(400001, req, param, body)
        // console.log(this.tc.v);
        console.log('this.userService.configFactory.v = ', this.userService.configFactory.v);
        console.log('this.userService.useClassTest.v = ', this.userService.useClassTest.v);
        // console.log(this.userService.configService.get('jwtExpires30days'));
        // console.log('Headers: ', headers);
        // console.log('req: ', req.rawHeaders);
        // console.log(10000333, Object.getOwnPropertySymbols(request)[1]);
        return { res: 'res' };
    }
}
