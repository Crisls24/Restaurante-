import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get('DATABASE_URL') || config.get('MYSQL_URL') || config.get('MYSQL_PRIVATE_URL');
        if (url) {
          return {
            type: 'mysql' as const,
            url,
            autoLoadEntities: true,
            synchronize: true,
            ssl: { rejectUnauthorized: false },
          };
        }
        return {
          type: 'mysql' as const,
          host: config.get('MYSQLHOST') || config.get('MYSQL_HOST', 'localhost'),
          port: Number(config.get('MYSQLPORT') || config.get('MYSQL_PORT', 3306)),
          username: config.get('MYSQLUSER') || config.get('MYSQL_USER', 'resadmin'),
          password: config.get('MYSQLPASSWORD') || config.get('MYSQL_PASSWORD', 'reservaciones_pass'),
          database: config.get('MYSQLDATABASE') || config.get('MYSQL_DATABASE', 'reservaciones_db'),
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
