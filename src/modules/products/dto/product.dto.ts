import { ICharacteristics } from '../../../shared/interfaces/prop.interfaces';

export class UpdateProductDto {
    readonly name?: string;
    readonly brand?: string;
    readonly category?: string;
    readonly subCategory?: string;
    readonly unit: string;
    readonly price?: string;
    readonly quantity?: string;
    readonly availability?: string;
    readonly info?: string;
    readonly description?: string;
    readonly tags?: string;
    readonly photos?: string;
    readonly characteristics?: ICharacteristics;
}

export class CreateProductDto extends UpdateProductDto {
    readonly name: string;
    readonly category: string;
    readonly subCategory: string;
    readonly characteristics: ICharacteristics;
}

export class RateDto {
    readonly [userID: string]: 1 | 2 | 3 | 4 | 5;
}

export class Characteristics {
    readonly [key: string]: any;
    // weight: string;
    // color?: string;
    // material?: string;
    // size?: string;
}
