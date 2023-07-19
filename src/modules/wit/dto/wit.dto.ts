import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsIn, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { EPostsGet } from '../../../shared/enums/posts.enum';
import { EPhraseDifficult, EPhraseType } from '../../../shared/enums/wit.enum';

export class UpdateWitItemDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly name?: string;

    // @ApiProperty()
    // @IsString()
    // @IsOptional()
    // readonly category?: string;
    //
    // @ApiProperty()
    // @IsBoolean()
    // @IsOptional()
    // readonly availability?: boolean;
}

export class CreateWitItemDto extends UpdateWitItemDto {
    @ApiProperty()
    @IsString()
    readonly name: string;
}

export class UpdatePhraseDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly phrase?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly translate?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly label?: string;

    @ApiProperty()
    @IsIn([EPhraseType.Phrase, EPhraseType.Word, EPhraseType.Collocation])
    @IsOptional()
    readonly type?: EPhraseType;

    @ApiProperty()
    @IsIn([EPhraseDifficult.Easy, EPhraseDifficult.Middle, EPhraseDifficult.Hard])
    @IsOptional()
    readonly difficult?: EPhraseDifficult;
}

export class CreatePhraseDto extends UpdatePhraseDto {
    @ApiProperty()
    @IsString()
    readonly phrase: string;

    @ApiProperty()
    @IsString()
    readonly translate: string;
}

export class ParamIdWitDto {
    @ApiProperty()
    @IsString()
    readonly listId: string;
}

export class ParamIdPhraseDto {
    @ApiProperty()
    @IsString()
    readonly phraseId: string;
}

export class ParamIdWitDelDto {
    @ApiProperty()
    @IsString()
    readonly listId: string;

    @ApiProperty()
    @IsString()
    readonly phraseId: string;
}
