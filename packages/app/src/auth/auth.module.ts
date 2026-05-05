import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { Cache } from 'cache-manager'
import { AuthConfigWrapper } from './auth-config.wrapper'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt'
import { AccessTokenService, RefreshTokenCacheService, RefreshTokenService } from './token'

@Module({
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [
        ConfigService,
        JwtService,
        AuthConfigWrapper,
        AccessTokenService,
        RefreshTokenService,
        {
            provide: RefreshTokenCacheService,
            useFactory: (authConfig: AuthConfigWrapper, cacheService: Cache) =>
                new RefreshTokenCacheService(authConfig, cacheService),
            inject: [AuthConfigWrapper, CACHE_MANAGER],
        },
        AuthService,
        JwtAuthGuard,
    ],
})
export class AuthModule {}
