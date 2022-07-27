import { Controller, Get, HttpCode, HttpStatus, Param, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../users/authorization/roles.decorator';
import { ERole } from '../../shared/enums/role.enum';
import { PostGetParamDto } from '../posts/dto/posts.dto';
import { DocsService } from './docs.service';

@Controller('docs')
export class DocsController {
  constructor(private docsService: DocsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @Roles([ERole.Admin, ERole.Customer])
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  getPostsAggregate(@Param() param, @Req() req) {
    return this.docsService.getDocs(param, req);
  }
}
