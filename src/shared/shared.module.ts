import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from "../users/strategies/google.strategy";
import { LocalStrategy } from "../users/strategies/local.strategy";
import { JwtStrategy } from "../users/strategies/jwt.strategy";

@Module({
  imports: [
    // PassportModule,
    EmailModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.TOKEN_SECRET,
        // signOptions: { expiresIn: '5d' }, // use if not to point in jwtService.sign({ expiresIn: '...'})
      }),
    }),
    // JwtModule.register({
    //   secret: process.env.TOKEN_SECRET,
    //   signOptions: { expiresIn: '60s' },
    // }),
  ],
  exports: [
    EmailModule,
    JwtModule,
    // PassportModule,
  ],
})
export class SharedModule {}
