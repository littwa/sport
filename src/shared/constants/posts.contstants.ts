import { ESortOrderBy } from '../enums/common.enum';
import { IPagination } from '../interfaces/common.interfaces';

export const PAGINATION_POSTS_DEFAULT: IPagination = {
  sort: ESortOrderBy.ASC,
  size: 5,
  page: 1,
};

export const GET_POSTS_BODY_DEFAULT = {
  pagination: PAGINATION_POSTS_DEFAULT,
};
