import { ECharacteristics, ProductsCategoryEnum, ProductsSubCategoryEnum } from '../enums/products.enum';

export interface IGetProdParam {
    category: ProductsSubCategoryEnum & ProductsCategoryEnum & undefined;
}

export interface IDelReviewParams {
    productId: string;
    commentId: string;
}