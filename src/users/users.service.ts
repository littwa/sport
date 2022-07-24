import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model, Types, ObjectId, Schema } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { ERole, EStatus } from 'src/shared/enums/role.enum';
import { EmailService } from 'src/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { CartProductUserParamDto, createUserCustomerDto, createUserDto } from './dto/creta-user.dto';
// import { Order, OrderDocument } from 'src/orders/orders.schema';
import * as bcrypt from 'bcrypt';
import { Session, SessionDocument } from './session.schema';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as sharp from 'sharp';
import { CommonService } from '../shared/services/common.service';

@Injectable()
export class UsersService {
  // private exp30days = this.configService.get('jwtExpires._30days').exp;
  // private str60s = this.configService.get('jwtExpires._60Seconds').exp;
  // private str30d = this.configService.get('jwtExpires._30days').exp;
  // private exp30d =
  //   Date.now() + this.configService.get('jwtExpires._30days').expIncrement;

  private refreshTokenPath = 'jwtExpires._30days';
  private accessTokenPath = 'jwtExpires._1hour'; // 'jwtExpires._60Seconds'; // 'jwtExpires._1hour'

  constructor(
    // @InjectModel(Order.name) private productModel: Model<OrderDocument>,
    @InjectModel(Session.name) public sessionModel: Model<SessionDocument>,
    @InjectModel(User.name) public userModel: Model<UserDocument>,
    private emailService: EmailService,
    private jwtService: JwtService,
    public configService: ConfigService,
    @Inject('UseFactoryTest') public configFactory: any,
    @Inject('UseClassTest') public useClassTest: any,
    private commonService: CommonService,
  ) {}

  async test(): Promise<any> {
    // console.log(1100033, this.userModel.estimatedDocumentCount());
    //console.log(1100044, this.userModel.count({ role: 'customer' }));
    // const f = await this.userModel.count();
    // const f = await this.userModel.countDocuments();
    // const f = await this.userModel.estimatedDocumentCount();
    const f = await this.userModel.find().sort({ _id: -1 }).limit(1);
    // const f = await this.userModel.find().sort({ $natural: -1 }).limit(1);
    console.log(1100055, f);

    // let coll = db.collection('collection_name');
    // coll.count().then((count) => {
    //   console.log(count);
    // });

    return this.userModel.find().count();
  }

  // async createUserAdmin(createUserDto: createUserDto): Promise<object> {
  //   let userAdmin = await this.userModel.findOne({
  //     email: createUserDto.email,
  //     role: ERole.Admin,
  //   });
  //
  //   if (!userAdmin) {
  //     userAdmin = await this.userModel.create({
  //       ...createUserDto,
  //     });
  //   }
  //
  //   const code = (
  //     Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
  //   ).toString();
  //
  //   const updatedUserAdmin = await this.userModel.findByIdAndUpdate(
  //     userAdmin._id,
  //     { verificationCode: code, status: EStatus.NotVerified },
  //     { new: true, useFindAndModify: false },
  //   );
  //
  //   this.emailService.sendUserConfirmation(
  //     updatedUserAdmin.email,
  //     updatedUserAdmin.verificationCode,
  //   );
  //
  //   const { password, verificationCode, __v, ...userAdminDtoReverse } =
  //     updatedUserAdmin.toObject();
  //
  //   return userAdminDtoReverse;
  // }

  async createUserCustomer(createUserCustomerDto: createUserCustomerDto): Promise<object> {
    let user = await this.userModel.findOne({
      email: createUserCustomerDto.email,
      role: ERole.Customer,
    });

    if (user) throw new BadRequestException('User customer with current email is registered');

    const hashPassword = await bcrypt.hash(createUserCustomerDto.password, 5);

    // const code = (
    //   Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
    // ).toString();

    console.log(createUserCustomerDto);

    user = await this.userModel.create({
      ...createUserCustomerDto,
      password: hashPassword,
      username: createUserCustomerDto.email.split('@')[0],
      // verificationCode: code,
      status: EStatus.Verified, // EStatus.NotVerified,
      // customer: createUserCustomerDto.customer,
    });

    // this.emailService.sendUserConfirmation(user.email, user.verificationCode);

    const { password, verificationCode, __v, ...userDtoReverse } = user.toObject();

    return userDtoReverse;
  }

  async updateUser(param, body, files: Array<Express.Multer.File>) {
    console.log(10066, param, body, files);
    const avatarURL = files && this.commonService.multerFactory(files)[0];
    const updatedUserCustomer = await this.userModel.findByIdAndUpdate(
      param.id,
      { ...body, ...(avatarURL && { avatarURL }) }, /// $set: dto
      { new: true },
    );
    const { password, verificationCode, __v, ...userDtoReverse } = updatedUserCustomer?.toObject();
    return userDtoReverse;
  }

  async signOutUser(parsedToken) {
    console.log(10000088, parsedToken);
    const deletedSession = await this.sessionModel.findByIdAndDelete(parsedToken.sid);

    if (!deletedSession) {
      throw new BadRequestException('No current session');
    }

    return { req: 'logOutUser Success' };
  }

  async getInfoUserCustomer({ _id }) {
    const infoCusomer = await this.userModel.findOne({ _id, role: ERole.Customer }).populate('customer');
    if (!infoCusomer) throw new BadRequestException('Customer was not found');
    const { password, verificationCode, __v, ...userDtoInfo } = infoCusomer.toObject();
    return userDtoInfo;
  }

  async getCurrentUser({ _id }) {
    const infoUser = await this.userModel
      .findOne({
        _id,
        role: ERole.Customer,
      })
      .populate('followers')
      .populate('following'); // .populate('customer');
    if (!infoUser) throw new BadRequestException('User was not found');
    const { password, verificationCode, __v, ...userDtoInfo } = infoUser.toObject();
    return userDtoInfo;
  }

  async signIn(signInDto) {
    const { email, password } = signInDto;

    const user = await this.userModel
      .findOne({ email, role: ERole.Customer })
      .populate('followers')
      .populate('following');

    if (!user) throw new BadRequestException('User was not found');
    if (user.status !== 'Verified') throw new BadRequestException('User not verified');

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new BadRequestException('Password wrong');

    const userObjectId = user._id;

    const createSession = await this.createSessionUtility(userObjectId);
    const tokens = this.getPairTokensUtility(createSession, user);

    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      status: user.status,
      role: user.role,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      // tokens,
    };
  }

  async addFavoriteProduct(productId: string, req) {
    const user = await this.userModel.findByIdAndUpdate(
      req.user._id,
      { $push: { favorites: productId } },
      { new: true },
    );

    return user;
  }

  async delFavoriteProduct(productId: string, req) {
    const user = await this.userModel.findByIdAndUpdate(
      req.user._id,
      { $pull: { favorites: productId } },
      { new: true },
    );

    return user;
  }

  async addCartProduct(param: CartProductUserParamDto, req) {
    const user = await this.userModel.findByIdAndUpdate(
      req.user._id,
      { $push: { cart: { productId: new mongoose.Types.ObjectId(param.productId), amount: param.amount } } },
      { new: true },
    );

    return user;
  }

  async delCartProduct(param: CartProductUserParamDto, req) {
    const user = await this.userModel.findByIdAndUpdate(
      req.user._id,
      { $pull: { cart: { productId: new mongoose.Types.ObjectId(param.productId), amount: param.amount } } },
      { new: true },
    );

    return user;
  }

  async follow(req, body) {
    const user = await this.userModel.findByIdAndUpdate(
      req.user._id,
      { $push: { followers: body.followId } },
      { new: true },
    );

    const follower = await this.userModel.findByIdAndUpdate(
      body.followId,
      { $push: { following: req.user._id } },
      { new: true },
    );

    return user;
  }

  async unfollow(req, body) {
    const user = await this.userModel.findByIdAndUpdate(
      req.user._id,
      { $pull: { followers: body.followId } },
      { new: true },
    );

    const follower = await this.userModel.findByIdAndUpdate(
      body.followId,
      { $pull: { following: req.user._id } },
      { new: true },
    );

    return user;
  }

  async getRefreshToken(req) {
    console.log(req.get('Authorization'), 888888881);

    if (!req.get('Authorization')) {
      throw new UnauthorizedException('Not authorized Token');
    }

    const token = req.get('Authorization' || '').slice(7);

    const parsedToken = await this.jwtService.verify(token, {
      secret: process.env.TOKEN_SECRET,
    });

    if (!parsedToken) throw new UnauthorizedException('Not authorized');

    const session = await this.sessionModel.findById(parsedToken.sid);
    const user = await this.userModel.findById(parsedToken.uid);

    if (!session || !user || user._id.toString() !== session.uid.toString())
      throw new UnauthorizedException('Not authorized');

    const delSession = await this.sessionModel.findByIdAndDelete(parsedToken.sid);

    const createSession = await this.createSessionUtility(parsedToken.uid);
    const newPairTokens = this.getPairTokensUtility(createSession, user);

    return newPairTokens;
  }

  getPairTokensUtility = (session, user) => {
    const accessToken = this.jwtService.sign(
      {
        sid: session._id,
        uid: session.uid,
        secret: process.env.TOKEN_SECRET,
        email: user.email,
        role: user.role,
      },
      { expiresIn: this.configService.get(this.accessTokenPath).exp },
    );
    const refreshToken = this.jwtService.sign(
      {
        sid: session._id,
        uid: session.uid,
        secret: process.env.TOKEN_SECRET,
        email: user.email,
        role: user.role,
      },
      { expiresIn: this.configService.get(this.refreshTokenPath).exp },
    );

    return { accessToken, refreshToken };
  };

  async createSessionUtility(uid) {
    const expRefreshToken = Date.now() + this.configService.get(this.refreshTokenPath).expIncrement;

    return await this.sessionModel.create({
      uid,
      expRefreshToken,
    });
  }

  async googleLogin(req) {
    if (!req.user) throw new UnauthorizedException('Not authorized');

    let user = await this.userModel
      .findOne({
        email: req.user.email,
        role: ERole.Customer,
        socialAuth: req.user.profile.provider,
      })
      .populate('followers')
      .populate('following');
    let isNew = false;
    if (!user) {
      user = await this.userModel.create({
        email: req.user.email,
        socialAuth: req.user.profile.provider,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        role: ERole.Customer,
        username: req.user.email.split('@')[0],
        avatarURL: req.user.picture,
        status: EStatus.NotRequiredVerification,
        // customer: '60e416946e3053133891ad81', // dummy
      });

      isNew = true;
    }

    if (!user) throw new UnauthorizedException('Not authorized');

    const userObjectId = user._id;

    const createSession = await this.createSessionUtility(userObjectId);
    const tokens = this.getPairTokensUtility(createSession, user);

    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      status: user.status,
      role: user.role,
      socialAuth: user.socialAuth,
      avatarURL: user.avatarURL,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      // isNew,
      // tokens,
    };
  }

  //=========================verifycation======================================

  // async verifycationAdmin(param) {
  //   try {
  //     const { verificationCode } = param;
  //     const mangerForVerification = await this.userModel.findOneAndUpdate(
  //       { verificationCode },
  //       {
  //         verificationCode: '',
  //         status: EStatus.Verified,
  //       },
  //       { new: true, useFindAndModify: false },
  //     );
  //
  //     if (!mangerForVerification) {
  //       throw new BadRequestException('No mangerForVerification');
  //     }
  //
  //     const accessToken = this.jwtService.sign(
  //       {
  //         uid: mangerForVerification._id,
  //         secret: process.env.TOKEN_SECRET,
  //         email: mangerForVerification.email,
  //         role: mangerForVerification.role,
  //       },
  //       // { expiresIn: "30d" },
  //     );
  //
  //     return {
  //       email: mangerForVerification.email,
  //       token: accessToken,
  //       role: mangerForVerification.role,
  //     };
  //   } catch (err) {
  //     throw new BadRequestException('Error');
  //   }
  // }

  // async verifycationCustomer(verificationCode) {
  //   const customerForVerification = await this.userModel.findOneAndUpdate(
  //     { verificationCode },
  //     { verificationCode: '', status: EStatus.Verified },
  //     { new: true, useFindAndModify: false },
  //   );
  //
  //   if (!customerForVerification)
  //     throw new BadRequestException('No customer For Verification');
  //
  //   return {
  //     email: customerForVerification.email,
  //     status: customerForVerification.status,
  //     username: customerForVerification.username,
  //     role: customerForVerification.role,
  //   }; // Redirect on sign-in
  // }
}
