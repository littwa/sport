import { Controller, Get, HttpCode, HttpStatus, Param, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/authorization/roles.decorator';
import { ERole } from 'src/shared/enums/role.enum';
import { PostGetParamDto } from 'src/modules/posts/dto/posts.dto';
import { AuxiliaryService } from 'src/modules/auxiliary/auxiliary.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommonService } from 'src/shared/services/common.service';

@ApiTags('aux')
@Controller('aux')
export class AuxiliaryController {
    constructor(private auxiliaryService: AuxiliaryService, private commonService: CommonService) {}

    @ApiResponse({ status: 200, description: 'Get Static Images List.' })
    @ApiResponse({ status: 404, description: 'Not found.' })
    @Get()
    @HttpCode(HttpStatus.OK)
    getStaticImagesList() {
        // const list = await this.commonService.getFileListingPath();
        // console.log(11050055, list);
        return this.commonService.getFileListingPath();
    }
}
