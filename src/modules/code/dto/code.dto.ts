import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsObject, IsOptional, IsString } from 'class-validator';
import { EFileType } from 'src/shared/enums/common.enum';

export class UpdateCodeDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly description?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly url?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly public_id?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly type?: string;

    @ApiProperty()
    // @IsString()
    @IsOptional()
    readonly tags?: string[];

    @ApiProperty()
    @IsObject()
    @IsOptional()
    readonly data?: {[key: string]: any}
}

export class CreateCodeDto extends UpdateCodeDto {
    @ApiProperty()
    @IsString()
    readonly description: string;

    @ApiProperty()
    @IsString()
    readonly type: string;
}
