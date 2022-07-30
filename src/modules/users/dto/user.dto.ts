import { IsIn, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ERole } from 'src/shared/enums/role.enum';

export class UserCreateDto {
  @ApiProperty({ enum: ['customer', 'admin'], enumName: 'ERole' })
  @IsIn(['customer', 'admin'])
  @IsOptional()
  readonly role: ERole;

  @ApiProperty()
  @IsString()
  readonly email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly password: string;

  @ApiProperty()
  @IsString()
  readonly username: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly firstName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly lastName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly verificationCode: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly dayOfBirth: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly yearOfBirth: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly avatarURL: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly status: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly country: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly hobby: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly occupation: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly city: string;

  // readonly verificationToken?: string;
  // readonly sessionToken?: string;
  // readonly accessToken?: string;
}

export class UserCustomerCreateDto extends UserCreateDto {
  @ApiProperty({ enum: ['customer', 'admin'], enumName: 'ERole' })
  @IsIn(['customer', 'admin'])
  readonly role: ERole;

  @ApiProperty()
  @IsString()
  readonly password: string;
}

export class CartProductUserParamDto {
  @IsString()
  readonly productId: string;

  @IsString()
  readonly amount: string;
}

// export class createUserCustomerDto extends createUserDto {
//     readonly password: string;
//     readonly username: string;
//     readonly age: string;
// }
