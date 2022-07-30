import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TesterService } from './tester.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/authorization/roles.decorator';
import { ERole } from 'src/shared/enums/role.enum';
import { TesterDto } from './dto/testers.dto';
import { Request } from 'express';
import { IRequestExt } from 'src/shared/interfaces/auth.interfaces';

@ApiTags('tester')
@Controller('tester')
export class TesterController {
  constructor(private testerService: TesterService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getProducts() {
    return this.testerService.getTester();
  }

  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: 200, description: 'Return ...' })
  @ApiResponse({ status: 404, description: 'Can not ...' })
  @ApiBearerAuth()
  @Post('add')
  @UseGuards(AuthGuard('jwt'))
  @Roles([ERole.Admin, ERole.Customer])
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  createTester(@Body() body: TesterDto, @Param() param: any, @Query() query: any, @Req() req: IRequestExt) {
    console.log('query=', query);
    console.log('param=', param);
    console.log('body=', body);
    console.log('req=', req);
    return this.testerService.createTester(param, query, body, req);
  }

  @ApiOperation({ summary: 'Execute tester' })
  @ApiResponse({ status: 200, description: 'Return tester.' })
  @ApiResponse({ status: 404, description: 'Can not Execute.' })
  @ApiBearerAuth()
  @Patch('edit/:testerId')
  @UseGuards(AuthGuard('jwt'))
  @Roles([ERole.Admin, ERole.Customer])
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  executeTester(@Body() body, @Param() param: any, @Query() query: any, @Req() req: IRequestExt) {
    console.log(100004, query);
    return this.testerService.executeTester(param, query, body, req);
  }
}
