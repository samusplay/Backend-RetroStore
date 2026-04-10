import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const getDatabaseConfig = (configService:ConfigService):TypeOrmModuleOptions => ({
    type:'postgres',
    url:configService.get<string>('DATABASE_URL'),
    autoLoadEntities:true,
    synchronize:true,

})

