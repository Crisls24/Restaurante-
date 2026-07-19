import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        const url = config.get<string>('DATABASE_URL') || config.get<string>('MYSQL_URL') || config.get<string>('MYSQL_PRIVATE_URL');
        if (url) {
          return {
            type: 'mysql',
            url,
            autoLoadEntities: true,
            synchronize: true,
          };
        }
        return {
          type: 'mysql',
          host: config.get<string>('MYSQLHOST') || config.get<string>('MYSQL_HOST', 'localhost'),
          port: parseInt(config.get<string>('MYSQLPORT') || config.get<string>('MYSQL_PORT', '3306'), 10),
          username: config.get<string>('MYSQLUSER') || config.get<string>('MYSQL_USER', 'resadmin'),
          password: config.get<string>('MYSQLPASSWORD') || config.get<string>('MYSQL_PASSWORD', 'reservaciones_pass'),
          database: config.get<string>('MYSQLDATABASE') || config.get<string>('MYSQL_DATABASE', 'reservaciones_db'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    UsersModule,
    AuthModule,
    NotificationsModule,
  ],
})
export class AppModule {}
