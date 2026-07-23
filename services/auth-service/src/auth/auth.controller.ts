import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario (mantenido para compatibilidad)' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('create-employee')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear empleado (solo admin)' })
  createEmployee(@Body() dto: CreateEmployeeDto) {
    return this.authService.createEmployee(dto);
  }

  @Post('seed-admin')
  @ApiOperation({ summary: 'Crear admin por defecto si no existe (one-time)' })
  seedAdmin() {
    return this.authService.seedAdmin();
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesion y obtener JWT' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.sub);
  }
}
