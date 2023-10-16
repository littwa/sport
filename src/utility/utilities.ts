import { IGetProdParam } from '../shared/interfaces/products.interfaces';
import {
    EBooleanTypesFilter,
    ECharacteristics,
    ENumberTypesFilter,
    ProductsCategoryEnum,
    ProductsSubCategoryEnum,
} from '../shared/enums/products.enum';
import { SPECIFY_ORDER_MAP } from '../shared/constants/common.constants';
import { TQueryOrderSpecify } from '../shared/types/common.types';

export function addLeadingZeros(num: number, totalLength: number): string {
    return String(num).padStart(totalLength, '0');
}

export function filterObject(obj, keys): any {
    return Object.fromEntries(Object.entries(obj).filter(m => keys.includes(m[0])));
}

export function defineCategory(param: IGetProdParam): any {
    const regex1 = new RegExp(param.category, 'i');
    const key = Object.values(ProductsSubCategoryEnum).includes(param.category)
        ? 'sub_category'
        : Object.values(ProductsCategoryEnum).includes(param.category)
        ? 'category'
        : '';
    return key ? { [key]: { $regex: regex1 } } : undefined;
}

export function prepareQueryFilter(query): any {
    let arr = [];
    Object.entries(query).forEach(([k, v]: [any, string]) => {
        console.log(k, v);
        if (Object.values(ENumberTypesFilter).includes(k)) {
            const [from, to] = v.split('_');
            arr = [...arr, { [`${inc(k)}${k}`]: { $gte: +from, ...(to && { $lte: +to }) } }];
        } else if (Object.values(EBooleanTypesFilter).includes(k)) {
            arr = [...arr, { [`${inc(k)}${k}`]: { $eq: /true/i.test(v) } }];
        } else {
            const values = v.split(';').map(v => new RegExp(v, 'i'));
            // const regex = new RegExp(filter.name, 'i');
            arr = [...arr, { [`${inc(k)}${k}`]: { $in: values } }];
        }
    });
    return arr;
}

export function inc(key): string {
    return Object.values(ECharacteristics).includes(key) ? 'characteristics.' : '';
}

export function sortUtilityValidator(sort: string): any[] {
    const [sortField, specify] = sort ? sort.split('_') : [];

    if (!(specify === 'asc' || specify === 'desc')) {
        return [];
    }

    return sortField ? [{ $sort: { [sortField]: SPECIFY_ORDER_MAP[specify] } }] : [];
}
