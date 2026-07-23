import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('El email ya esta registrado');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({ ...dto, password_hash: hash });
    const saved = await this.usersRepo.save(user);

    const { password_hash, ...result } = saved as any;
    return { message: 'Usuario registrado exitosamente', usuario: result };
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Credenciales invalidas');

    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) throw new UnauthorizedException('Credenciales invalidas');

    const payload = { sub: user.id_usuario, email: user.email, rol: user.rol };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      usuario: {
        id: user.id_usuario,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.usersRepo.findOne({ where: { id_usuario: userId } });
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    const { password_hash, ...result } = user as any;
    return result;
  }

  async createEmployee(dto: CreateEmployeeDto) {
    const exists = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('El email ya esta registrado');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      email: dto.email,
      telefono: dto.telefono,
      password_hash: hash,
      rol: dto.rol as UserRole,
    });
    const saved = await this.usersRepo.save(user);

    const { password_hash, ...result } = saved as any;
    return { message: 'Empleado creado exitosamente', usuario: result };
  }

  async seedAdmin() {
    const adminEmail = 'admin@xiu.mx';
    const exists = await this.usersRepo.findOne({ where: { email: adminEmail } });
    if (exists) return null;

    const hash = await bcrypt.hash('admin123', 10);
    const admin = this.usersRepo.create({
      nombre: 'Admin',
      apellido: 'Xiú',
      email: adminEmail,
      password_hash: hash,
      rol: UserRole.ADMIN,
    });
    const saved = await this.usersRepo.save(admin);
    const { password_hash, ...result } = saved as any;
    return result;
  }
}
