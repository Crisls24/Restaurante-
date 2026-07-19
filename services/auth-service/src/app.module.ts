import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';

function parseMySQLUrl(url: string) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port || '3306', 10),
    username: parsed.username,
    password: parsed.password,
    database: parsed.pathname.replace(/^\//, ''),
  };
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        const dbUrl = config.get<string>('DATABASE_URL')
          || config.get<string>('MYSQL_PUBLIC_URL')
          || config.get<string>('MYSQL_URL')
          || config.get<string>('MYSQL_PRIVATE_URL');

        if (dbUrl) {
          try {
            const parsed = parseMySQLUrl(dbUrl);
            console.log('[DB] Parsed URL -> host:', parsed.host, 'port:', parsed.port, 'db:', parsed.database);
            return {
              type: 'mysql',
              host: parsed.host,
              port: parsed.port,
              username: parsed.username,
              password: parsed.password,
              database: parsed.database,
              autoLoadEntities: true,
              synchronize: true,
              ssl: { rejectUnauthorized: false },
            };
          } catch (e) {
            console.log('[DB] URL parse failed, falling back to host/port:', e);
          }
        }

        const host = config.get<string>('MYSQLHOST') || 'localhost';
        console.log('[DB] Fallback -> host:', host);
        return {
          type: 'mysql',
          host,
          port: parseInt(config.get<string>('MYSQLPORT') || '3306', 10),
          username: config.get<string>('MYSQLUSER') || 'resadmin',
          password: config.get<string>('MYSQLPASSWORD') || 'reservaciones_pass',
          database: config.get<string>('MYSQLDATABASE') || 'reservaciones_db',
          autoLoadEntities: true,
          synchronize: true,
          ssl: host !== 'localhost' ? { rejectUnauthorized: false } : undefined,
        };
      },
    }),
    UsersModule,
    AuthModule,
    NotificationsModule,
  ],
})
export class AppModule {}
