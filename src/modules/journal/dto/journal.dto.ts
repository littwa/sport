import { ApiProperty } from "@nestjs/swagger";
import {IsIn, IsObject, IsOptional, IsString } from "class-validator";
import {EDayJournal, EMonthJournal, EYearJournal} from "../../../shared/enums/journal.enum";


export class CreateEntryDto {
    @ApiProperty()
    @IsIn(Object.values(EDayJournal))
    readonly day: EDayJournal;

    @ApiProperty()
    @IsIn(Object.values(EMonthJournal))
    readonly month: EMonthJournal;

    @ApiProperty()
    @IsIn(Object.values(EYearJournal))
    readonly year: EYearJournal;

    @ApiProperty()
    @IsString()
    readonly entry: string;

    @ApiProperty()
    @IsOptional()
    @IsObject()
    readonly data: any;
}

export class UpdateEntryDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    readonly entry: string;

    @ApiProperty()
    @IsOptional()
    @IsObject()
    readonly data: any;
}

export class GetMonthEntryDto {
    @ApiProperty()
    @IsIn(Object.values(EMonthJournal))
    readonly month: EMonthJournal;

    @ApiProperty()
    @IsIn(Object.values(EYearJournal))
    readonly year: EYearJournal;
}
