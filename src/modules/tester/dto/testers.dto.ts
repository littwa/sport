import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { ETesterDistinct, ETesterStatus } from 'src/shared/enums/tester.enum';

export class TesterDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly description: string;

  @ApiProperty({ enum: ['a', 'b', 'c'] })
  @IsIn(['a', 'b', 'c'])
  @IsString()
  readonly status: ETesterStatus;

  @ApiProperty({ enum: ['xxx', 'yyy', 'zzz'] })
  @IsIn(['xxx', 'yyy', 'zzz'])
  @IsString()
  readonly distinct: ETesterDistinct;

  // @ApiProperty({ enum: ['new', 'canceled', 'in progress', 'delivered', 'completed'] })
  // @IsString()
  // @IsIn(['new', 'canceled', 'in progress', 'delivered', 'completed'])
  // readonly status: EOrderStatus;

  // @IsOptional()
  // @Length(24, 24)
  // @IsOptional()
  // @ApiPropertyOptional({ type: String, maxLength: 24, minLength: 24 })
  // readonly userId: string;
}
