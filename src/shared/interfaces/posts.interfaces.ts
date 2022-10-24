import { IPagination } from './common.interfaces';

export interface IGetPostsBody {
  pagination: IPagination;
}

export interface IPreResponse {
  data: any;
  pagination: any;
}
