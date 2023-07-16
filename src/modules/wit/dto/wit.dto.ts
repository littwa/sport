import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateWitItemDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly name?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly category?: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    readonly availability?: boolean;
}

export class CreateWitItemDto extends UpdateWitItemDto {
    @ApiProperty()
    @IsString()
    readonly name: string;
}
