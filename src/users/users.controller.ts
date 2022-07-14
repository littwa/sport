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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { NextFunction, Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { ERole } from 'src/shared/enums/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './authorization/roles.decorator';
import { RolesGuard } from './authorization/roles.guard';
import * as passport from 'passport';
import { ProductsModule } from '../products/products.module';
import { ProductsService } from '../products/products.service';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import { storage } from 'src/config/config-entity';
import * as sharp from 'sharp';
import { CommonService } from '../shared/services/common.service';
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

@Controller('users')
export class UsersController {
  constructor(
    private commonService: CommonService,
    private readonly userService: UsersService,
    @Inject('ProductsServiceToken') private productsService: ProductsService, // private readonly uf: // private tc: ConfigServiceTest,
  ) {}

  @Get('get-test')
  @UseInterceptors(AnyFilesInterceptor())
  getTest(@Request() request, @Headers() headers, @Request() req, @UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(1000001, request);
    return {
      // files: this.commonService.multerFactory(files),
      // req: req,
      BASE_URL_API: process.env.BASE_URL_API,
      processCwd: process.cwd(),
      dirname__: __dirname,
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
  async googleAuthRedirect(
    @Req() req,
    @Res() res,
    @Body() body,
    @Headers() headers,
    @Query() q,
  ) {
    const dto = await this.userService.googleLogin(req);
    const qString = Object.entries(dto).reduce((acc, el, i, arr) => {
      acc = acc + el[0].toString() + '=' + el[1].toString();
      if (arr.length - 1 !== i) acc = acc + '&';
      return acc;
    }, '');

    console.log(10000014);
    return {
      url: `${process.env.BASE_URL_FRONT_END}/?${qString}`,
    };

    // return res.redirect(`${process.env.BASE_URL_FRONT_END}/?${qString}`);
  }

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  postSignUpUser(@Body() body): any {
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

  @Get('sign-out')
  @UseGuards(AuthGuard('jwt'))
  signOut(@Request() req) {
    return this.userService.signOutUser(req.user);
  }

  @Post('up-date/:id')
  @UseInterceptors(AnyFilesInterceptor()) // { storage }
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Body() body,
    @Param() param,
    @Query() query,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log(1000005, body, param, query);
    return await this.userService.updateUser(param, body, files);
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
  @UseGuards(AuthGuard('jwt'))
  getCurrentUser(@Request() req) {
    console.log('req.user-', req.user);
    return this.userService.getCurrentUser(req.user);
  }

  @Post('sign-in')
  signInCustomer(@Body() body) {
    return this.userService.signIn(body);
  }

  @Post('follow')
  @UseGuards(AuthGuard('jwt'))
  // @Roles(ERole.Admin)
  follow(@Request() req, @Body() body) {
    return this.userService.follow(req, body);
  }

  @Post('unfollow')
  @UseGuards(AuthGuard('jwt'))
  // @Roles(ERole.Admin)
  unfollow(@Request() req, @Body() body) {
    return this.userService.unfollow(req, body);
  }

  @Get('local')
  @UseGuards(AuthGuard('local'))
  testAuthGuardLocal(@Request() req) {
    return req.user;
  }

  @Get('get/user-customer-info')
  @UseGuards(AuthGuard('jwt'))
  // @Roles(ERole.Admin)
  getCustomer(@Request() req) {
    return this.userService.getInfoUserCustomer(req.user);
  }

  @Get('refresh')
  @UseGuards(AuthGuard('jwt'))
  getRefreshToken(@Req() req) {
    return this.userService.getRefreshToken(req);
  }

  @Get('test-jwt')
  @UseGuards(AuthGuard('jwt'))
  getCurrentUserTest(
    @Headers() headers,
    @Request() request,
    @Req() req,
    @Param() param,
    @Body() body,
    // @Res() res,
  ) {
    // console.log(this.tc.v);
    console.log(10007, this.userService.configFactory.v);
    console.log(10008, this.userService.useClassTest.v);
    // console.log(this.userService.configService.get('jwtExpires30days'));
    // console.log('Headers: ', headers);
    // console.log('req: ', req.rawHeaders);
    // console.log('request: ', request);
    // console.log(10000333, Object.getOwnPropertySymbols(request)[1]);
    // console.log('param: ', param);
    // console.log('body: ', body);
    // console.log('res: ', res);
    return { res: 'res' };
  }
}
