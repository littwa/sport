import { Product } from 'src/modules/products/products.schema';
import { EStatus } from 'src/shared/enums/role.enum';
import { IDate } from 'src/shared/interfaces/prop.interfaces';

export class reviewsDto {
  // readonly documentNo: string;
  // readonly documentId: string;
  // readonly document: string;
  // readonly documentItems: string;
  // readonly documentNotes: string;
  // readonly status: string;
  // readonly ordered: string;
}

export class EditDto {
  readonly review: string;
  readonly tags: string[];
}

export class LikeDto {
  readonly [userID: string]: boolean;
}
