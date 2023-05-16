import { BaseCharacteristics, CATEGORY_PRODUCTS } from '../shared/constants/product.constants';
import { ProductsCategoryEnum, ProductsSubCategoryEnum } from '../shared/enums/products.enum';
import { CreateProductDto } from '../modules/products/dto/product.dto';

export function productsSubCategoryValidators(category: ProductsCategoryEnum, subCategory): boolean {
    if (subCategory === ProductsSubCategoryEnum.OTHER) {
        return false;
    }

    return !CATEGORY_PRODUCTS.find(v => v.category === category)
        .subCategories.map(s => s.category)
        .includes(subCategory);
}

// export function necessaryCharacteristicsValidators(createProductDto: CreateProductDto): boolean {
//     if (createProductDto.subCategory === ProductsSubCategoryEnum.OTHER) {
//         return false;
//     }
// }
