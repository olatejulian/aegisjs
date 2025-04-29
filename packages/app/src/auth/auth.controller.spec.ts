import {ConfigService} from '@nestjs/config'
import {JwtService} from '@nestjs/jwt'
import {Test, TestingModule} from '@nestjs/testing'
import {AuthConfigWrapper} from './auth-config.wrapper'
import {AuthController} from './auth.controller'
import {AuthService} from './auth.service'
import {
    AccessTokenService,
    RefreshTokenCacheService,
    RefreshTokenService,
} from './token'

describe('AuthController', () => {
    let controller: AuthController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
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

        controller = module.get<AuthController>(AuthController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
