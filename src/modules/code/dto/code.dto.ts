import { ApiProperty } from '@nestjs/swagger';
import {IsArray, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

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
    @IsArray()
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
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly type: string;
}
