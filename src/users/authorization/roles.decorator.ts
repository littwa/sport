import { SetMetadata } from '@nestjs/common';
import { ERole } from 'src/shared/enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (role: ERole) => SetMetadata(ROLES_KEY, role);
