import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { Observable, of } from 'rxjs';
import * as sharp from 'sharp';
import { STATIC, UPLOADS, UPLOADS_STATIC } from '../constants/url.constants';
import * as fs from 'fs';

@Injectable()
export class CommonService {
    // // private exp30days = this.configService.get('jwtExpires30days').exp;
    // private str60s = this.configService.get('jwtExpires60Seconds').exp;
    // private str30d = this.configService.get('jwtExpires30days').exp;
    // private exp30d =
    //     Date.now() + this.configService.get('jwtExpires30days').expIncrement;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
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
        return files.map(file => {
            const uniqueSuffix = Date.now();
            const ext = '.webp'; //  path.parse(file.originalname).ext;
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

    public async getFileListing(directory?: string): Promise<Array<string>> {
        const promise$$$ = new Promise((resolve, rej) => {
            fs.readdir(process.cwd() + '/uploads/static', (err, files) => {
                const results = new Array<string>();
                files.forEach(file => {
                    console.log('file: ', `${process.env.BASE_URL_API}/${UPLOADS}/${STATIC}/${file}`);
                    results.push(`${process.env.BASE_URL_API}/${UPLOADS}/${STATIC}/${file}`);
                });
                resolve(results);
            });
        });

        console.log('promise- ', promise$$$);
        return promise$$$ as Promise<Array<string>>;
    }

    public async getFileListingPath(directory?: string): Promise<Array<string>> {
        const promise = new Promise((resolve, rej) => {
            fs.readdir(process.cwd() + '/uploads/static', (err, files) => {
                const results = files.map(file => `${UPLOADS}/${STATIC}/${file}`);
                resolve(results);
            });
        });

        return promise as Promise<Array<string>>;
    }
}
