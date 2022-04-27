import { Global, Injectable, Module } from '@nestjs/common';
import { TesterService } from './tester.service';
import { TesterController } from './tester.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Favorite, TesterSchema } from './tester.schema';
import { ProductsService } from '../products/products.service';
import { ProductsModule } from '../products/products.module';
import { AppService } from '../app.service';
import { ConfigModule } from '@nestjs/config';
import { TesterAService } from './tester.a.service';
import { TesterBService } from './tester.b.service';
// import { OrdersService } from 'src/orders/orders.service';
// import { OrdersModule } from 'src/orders/orders.module';

//=============================================================
@Injectable()
export class ConfigServiceTest {
  public v = 'ConfigServiceTest';
}

@Injectable()
class DevelopmentConfigService {
  public v = 'DevelopmentConfigService';
}

@Injectable()
class ProductionConfigService {
  public v = 'ProductionConfigService';
}
//==================================================================
export const useClassTest = {
  provide: 'UseClassTest',
  useClass: (() => {
    console.log(110044, process.env.NODE_ENV); // undefined ???
    return process.env.NODE_ENV === 'development'
      ? DevelopmentConfigService
      : ProductionConfigService;
  })(),
};
//=============================================================
const useFactoryTest = {
  provide: 'UseFactoryTest',
  useFactory: (configServiceTest: ConfigServiceTest) => {
    console.log(10009, process.env.NODE_ENV, configServiceTest.v);
    return process.env.NODE_ENV === 'development'
      ? new DevelopmentConfigService()
      : new ProductionConfigService();
  },
  inject: [ConfigServiceTest],
};
//=============================================================

@Global()
@Module({
  imports: [
    // ProductsModule,
    MongooseModule.forFeature([{ name: Favorite.name, schema: TesterSchema }]),
  ],
  controllers: [TesterController],
  providers: [
    TesterService,
    TesterAService,
    TesterBService,
    ConfigServiceTest,
    useFactoryTest,
    useClassTest,
  ],
  exports: [TesterService, useFactoryTest, useClassTest],
})
export class TesterModule {}
