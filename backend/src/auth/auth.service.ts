import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  private refreshTokens: Map<string, { userId: string; expires: Date }> = new Map();

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    if (user.status === 'INACTIVO') {
      throw new UnauthorizedException('Usuario inactivo');
    }
    return this.generateTokens(user.id, user.role);
  }

  async register(dto: { name: string; email: string; password: string; companyName?: string; companyNit?: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('El email ya está registrado');

    let companyId: string | undefined;

    if (dto.companyName) {
      if (dto.companyNit) {
        const dup = await this.prisma.company.findUnique({ where: { nit: dto.companyNit } });
        if (dup) throw new ConflictException('El NIT ya está registrado');
      }
      const company = await this.prisma.company.create({
        data: { name: dto.companyName, nit: dto.companyNit ?? `TMP-${uuid().slice(0, 8)}` },
      });
      companyId = company.id;
    }

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: await bcrypt.hash(dto.password, 10),
        role: Role.MIPYME,
        companyId,
      },
    });

    return this.generateTokens(user.id, user.role);
  }

  async refresh(refreshToken: string) {
    const stored = this.refreshTokens.get(refreshToken);
    if (!stored || stored.expires < new Date()) {
      this.refreshTokens.delete(refreshToken);
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
    const user = await this.prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user) throw new UnauthorizedException();
    this.refreshTokens.delete(refreshToken);
    return this.generateTokens(user.id, user.role);
  }

  async logout(refreshToken: string) {
    this.refreshTokens.delete(refreshToken);
  }

  private generateTokens(userId: string, role: Role) {
    const accessToken = this.jwt.sign(
      { sub: userId, role },
      { expiresIn: this.config.get('JWT_EXPIRES_IN', '15m') },
    );
    const refreshToken = uuid();
    this.refreshTokens.set(refreshToken, {
      userId,
      expires: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    });
    return { accessToken, refreshToken };
  }
}
