import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types, ObjectId, Schema } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { ERole, EStatus } from 'src/shared/enums/role.enum';
import { EmailService } from 'src/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { createUserCustomerDto, createUserDto } from './dto/creta-user.dto';
// import { Order, OrderDocument } from 'src/orders/orders.schema';
import * as bcrypt from 'bcrypt';
import { Session, SessionDocument } from './session.schema';
console.log(11111111111, JwtService);
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    // @InjectModel(Order.name) private productModel: Model<OrderDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async createUserAdmin(createUserDto: createUserDto): Promise<object> {
    let userAdmin = await this.userModel.findOne({
      email: createUserDto.email,
      role: ERole.Admin,
    });

    if (!userAdmin) {
      userAdmin = await this.userModel.create({
        ...createUserDto,
      });
    }

    const code = (
      Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
    ).toString();

    const updatedUserAdmin = await this.userModel.findByIdAndUpdate(
      userAdmin._id,
      { verificationCode: code, status: EStatus.NotVerified },
      { new: true, useFindAndModify: false },
    );

    this.emailService.sendUserConfirmation(
      updatedUserAdmin.email,
      updatedUserAdmin.verificationCode,
    );

    const { password, verificationCode, __v, ...userAdminDtoReverse } =
      updatedUserAdmin.toObject();

    return userAdminDtoReverse;
  }

  async verifycationAdmin(param) {
    try {
      const { verificationCode } = param;
      const mangerForVerification = await this.userModel.findOneAndUpdate(
        { verificationCode },
        {
          verificationCode: '',
          status: EStatus.Verified,
        },
        { new: true, useFindAndModify: false },
      );

      if (!mangerForVerification) {
        throw new BadRequestException('No mangerForVerification');
      }

      const accessToken = this.jwtService.sign(
        {
          uid: mangerForVerification._id,
          secret: process.env.TOKEN_SECRET,
          email: mangerForVerification.email,
          role: mangerForVerification.role,
        },
        // { expiresIn: "30d" },
      );

      return {
        email: mangerForVerification.email,
        token: accessToken,
        role: mangerForVerification.role,
      };
    } catch (err) {
      throw new BadRequestException('Error');
    }
  }

  //===================================================

  async createUserCustomer(
    createUserCustomerDto: createUserCustomerDto,
  ): Promise<object> {
    let user = await this.userModel.findOne({
      email: createUserCustomerDto.email,
      role: ERole.Customer,
    });

    if (user)
      throw new BadRequestException(
        'User customer with current email is registered',
      );

    const hashPassword = await bcrypt.hash(createUserCustomerDto.password, 5);

    // const code = (
    //   Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
    // ).toString();

    console.log(createUserCustomerDto);

    user = await this.userModel.create({
      ...createUserCustomerDto,
      password: hashPassword,
      // verificationCode: code,
      status: EStatus.Verified, // EStatus.NotVerified,
      customer: createUserCustomerDto.customer,
    });

    // this.emailService.sendUserConfirmation(user.email, user.verificationCode);

    const { password, verificationCode, __v, ...userDtoReverse } =
      user.toObject();

    return userDtoReverse;
  }

  async updateUserCustomer(id, dto) {
    const updatedUserCustomer = await this.userModel.findByIdAndUpdate(
      id,
      { ...dto }, /// $set: dto
      { new: true, useFindAndModify: false },
    );

    const { password, verificationCode, __v, ...userDtoReverse } =
      updatedUserCustomer.toObject();
    return userDtoReverse;
  }

  async verifycationCustomer(verificationCode) {
    const customerForVerification = await this.userModel.findOneAndUpdate(
      { verificationCode },
      { verificationCode: '', status: EStatus.Verified },
      { new: true, useFindAndModify: false },
    );

    if (!customerForVerification)
      throw new BadRequestException('No customer For Verification');

    return {
      email: customerForVerification.email,
      status: customerForVerification.status,
      username: customerForVerification.username,
      role: customerForVerification.role,
    }; // Redirect on sign-in
  }

  async signIn(signInDto) {
    const { email, password } = signInDto;

    const user = await this.userModel.findOne({ email, role: ERole.Customer });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!user) throw new BadRequestException('User was not found');
    if (!isPasswordValid) throw new BadRequestException('Password wrong');
    if (user.status !== 'Verified')
      throw new BadRequestException('User not verified');

    const userObjectId = user._id;

    const createSession = await this.sessionModel.create({
      uid: userObjectId,
    });

    const tokens = await this.getPairTokensUtilit(createSession, user);

    return {
      name: user.username,
      email: user.email,
      status: user.status,
      role: user.role,
      tokens,
    };
  }

  async getInfoUserCustomer({ _id }) {
    const infoCusomer = await this.userModel
      .findOne({ _id, role: ERole.Customer })
      .populate('customer');
    if (!infoCusomer) throw new BadRequestException('Customer was not found');
    const { password, verificationCode, __v, ...userDtoInfo } =
      infoCusomer.toObject();
    return userDtoInfo;
  }

  async getRefreshToken(req) {
    const token = req.get('Authorization' || '').slice(7);

    const parsedToken = await this.jwtService.verify(token, {
      secret: process.env.TOKEN_SECRET,
    });

    if (!parsedToken) throw new UnauthorizedException('Not authorized');

    const session = await this.sessionModel.findById(parsedToken.sid);
    const user = await this.userModel.findById(parsedToken.uid);

    if (!session || !user || user._id.toString() !== session.uid.toString())
      throw new UnauthorizedException('Not authorized');

    const delSession = await this.sessionModel.findByIdAndDelete(
      parsedToken.sid,
    );

    const newSession = await this.sessionModel.create({ uid: parsedToken.uid });

    const newPairTokens = this.getPairTokensUtilit(newSession, user);

    return newPairTokens;
  }

  getPairTokensUtilit = async (session, user) => {
    const accessToken = await this.jwtService.sign(
      {
        sid: session._id,
        uid: session.uid,
        secret: process.env.TOKEN_SECRET,
        email: user.email,
        role: user.role,
      },
      { expiresIn: '120s' },
    );
    const refreshToken = await this.jwtService.sign(
      {
        sid: session._id,
        uid: session.uid,
        secret: process.env.TOKEN_SECRET,
        email: user.email,
        role: user.role,
      },
      { expiresIn: '30d' },
    );

    return { accessToken, refreshToken };
  };

  async googleLogin(req) {
    if (!req.user) throw new UnauthorizedException('Not authorized');

    let user = await this.userModel.findOne({
      email: req.user.email,
      role: ERole.Customer,
      socialAuth: req.user.profile.provider,
    });
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
        customer: '60e416946e3053133891ad81', // dummy
      });

      isNew = true;
    }

    if (!user) throw new UnauthorizedException('Not authorized');

    const userObjectId = user._id;

    const createSession = await this.sessionModel.create({
      uid: userObjectId,
    });

    const tokens = await this.getPairTokensUtilit(createSession, user);

    return {
      name: user.username,
      email: user.email,
      status: user.status,
      role: user.role,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      // tokens,
      isNew,
      userId: userObjectId,
    };
  }
}
