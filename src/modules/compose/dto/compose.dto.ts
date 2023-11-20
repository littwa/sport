import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { EComposeType } from '../../../shared/enums/compose.enum';
import { ComposeList } from '../compose-list.schema';

export class CreateComposeListDto {
    @ApiProperty()
    @IsString()
    readonly name: string;
}

export class ParamIdComposeDto {
    @ApiProperty()
    @IsString()
    readonly id: string;
}

export class ParamIdComposeDelDto {
    @ApiProperty()
    @IsString()
    readonly listId: string;

    @ApiProperty()
    @IsString()
    readonly composeId: string;
}

export class UpdateComposeDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly expression?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly translate?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly url?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly public_id?: string;

    @ApiProperty()
    @IsIn([EComposeType.Image, EComposeType.Video, EComposeType.Audio])
    @IsOptional()
    readonly old_file_type?: EComposeType;


    @ApiProperty()
    @IsIn([EComposeType.Image, EComposeType.Video, EComposeType.Audio])
    @IsOptional()
    readonly type?: EComposeType;
}

export class CreateComposeDto extends UpdateComposeDto {
    @ApiProperty()
    @IsString()
    readonly expression: string;

    @ApiProperty()
    @IsString()
    readonly translate: string;
}
