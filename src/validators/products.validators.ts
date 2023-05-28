import { BaseCharacteristics, CATEGORY_PRODUCTS } from '../shared/constants/product.constants';
import { ProductsCategoryEnum, ProductsSubCategoryEnum } from '../shared/enums/products.enum';
import { CreateProductDto } from '../modules/products/dto/product.dto';
import { SPECIFY_ORDER_MAP } from '../shared/constants/common.constants';

export function productsSubCategoryValidators(category: ProductsCategoryEnum, sub_category): boolean {
    if ((category && !sub_category) || (sub_category && !category)) {
        return true;
    }

    if (sub_category === ProductsSubCategoryEnum.OTHER) {
        return false;
    }

    return !CATEGORY_PRODUCTS.find(v => v.category === category).subCategories.find(s => s.category === sub_category);
}

export function characteristicsValidators(dto: CreateProductDto): [boolean, string[]] {
    const sub_category = CATEGORY_PRODUCTS.find(v => v.category === dto.category).subCategories.find(
        x => x.category === dto.sub_category,
    );
    const isInvalid = !sub_category.filter.every(f => Object.keys(dto.characteristics).includes(f));
    console.log(10001, sub_category.filter, isInvalid);
    // Object.keys(dto.characteristics).every(k => sub_category.filter.includes(k));
    return [isInvalid, sub_category.filter];
}
