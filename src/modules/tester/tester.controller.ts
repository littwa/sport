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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TesterService } from './tester.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../authorization/roles.decorator';
import { ERole } from '../../shared/enums/role.enum';

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
  @Post('tester/add')
  @UseGuards(AuthGuard('jwt'))
  @Roles([ERole.Admin, ERole.Customer])
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  createTester(@Body() body, @Param() param: any, @Query() query: any) {
    console.log(100004, query);
    return this.testerService.createTester(param, query, body);
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
  executeTester(@Body() body, @Param() param: any, @Query() query: any) {
    console.log(100004, query);
    return this.testerService.executeTester(param, query, body);
  }
}
