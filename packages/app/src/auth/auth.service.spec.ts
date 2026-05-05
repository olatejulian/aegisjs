import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthConfigWrapper } from './auth-config.wrapper'
import { AuthService } from './auth.service'
import { AccessTokenService, RefreshTokenCacheService, RefreshTokenService } from './token'

describe('AuthService', () => {
    let service: AuthService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                AuthConfigWrapper,
                AccessTokenService,
                RefreshTokenService,
                RefreshTokenCacheService,
                ConfigService,
                JwtService,
            ],
        }).compile()

        service = module.get<AuthService>(AuthService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
