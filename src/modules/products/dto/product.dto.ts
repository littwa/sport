import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { ProductsCategoryEnum, ProductsSubCategoryEnum } from '../../../shared/enums/products.enum';
import { Characteristics } from '../products.schema';

export class UpdateProductDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly name?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly category?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly sub_category?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly unit?: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    readonly quantity?: number;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    readonly availability?: boolean;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly info?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly description?: string;

    @ApiProperty()
    @IsArray()
    @IsOptional()
    readonly tags?: string[];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    readonly photos?: string[];

    @ApiProperty()
    @IsObject()
    @IsOptional()
    readonly characteristics?: Characteristics;
}

export class CreateProductDto extends UpdateProductDto {
    @ApiProperty()
    @IsString()
    readonly name: string;

    @ApiProperty()
    @IsString()
    readonly category: string;

    @ApiProperty()
    @IsString()
    readonly sub_category: string;

    @ApiProperty()
    @IsObject()
    readonly characteristics: Characteristics;
}

export class RateDto {
    readonly [userID: string]: 1 | 2 | 3 | 4 | 5;
}
