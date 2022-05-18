import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as sharp from 'sharp';
import { UPLOADS } from '../constants/url.constants';

@Injectable()
export class CommonService {
  // // private exp30days = this.configService.get('jwtExpires30days').exp;
  // private str60s = this.configService.get('jwtExpires60Seconds').exp;
  // private str30d = this.configService.get('jwtExpires30days').exp;
  // private exp30d =
  //     Date.now() + this.configService.get('jwtExpires30days').expIncrement;

  constructor() {} // @Inject('UseClassTest') public useClassTest: any, // @Inject('UseFactoryTest') public configFactory: any, // public configService: ConfigService, // private jwtService: JwtService, // private emailService: EmailService, // @InjectModel(User.name) public userModel: Model<UserDocument>, // @InjectModel(Session.name) public sessionModel: Model<SessionDocument>, // @InjectModel(Order.name) private productModel: Model<OrderDocument>,

  // getPairTokensUtilit = async (session, user) => {
  //     const accessToken = await this.jwtService.sign(
  //         {
  //             sid: session._id,
  //             uid: session.uid,
  //             secret: process.env.TOKEN_SECRET,
  //             email: user.email,
  //             role: user.role,
  //         },
  //         { expiresIn: '30d' },
  //     );
  //     const refreshToken = await this.jwtService.sign(
  //         {
  //             sid: session._id,
  //             uid: session.uid,
  //             secret: process.env.TOKEN_SECRET,
  //             email: user.email,
  //             role: user.role,
  //         },
  //         { expiresIn: '60d' },
  //     );
  //
  //     return { accessToken, refreshToken };
  // };

  multerFactory(files: Array<Express.Multer.File>): string[] {
    return files.map((file) => {
      const uniqueSuffix = Date.now();
      const ext = '.webp'; // path.parse(file.originalname).ext;
      // console.log(
      //   `${process.env.BASE_URL_API}/${UPLOADS}/${uniqueSuffix}${ext}`,
      // );
      sharp(file.buffer)
        .resize(240, 240)
        // .jpeg({ mozjpeg: true })
        .toFile(process.cwd() + '/uploads/' + uniqueSuffix + ext, (err, info) =>
          console.log(1000666, err, info),
        );
      return `${process.env.BASE_URL_API}/${UPLOADS}/${uniqueSuffix}${ext}`;
    });
  }
}
