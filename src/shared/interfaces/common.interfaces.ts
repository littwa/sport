import { ESortOrderBy } from '../enums/common.enum';

export interface IPagination {
  sort: ESortOrderBy;
  size: number;
  page: number;
}
