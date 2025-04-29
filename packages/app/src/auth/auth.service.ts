import {Injectable} from '@nestjs/common'
import {EmailAddress} from '@ts-api-example/core'
import {AuthTokensDto} from './dto'
import {
    AccessTokenService,
    RefreshTokenCacheService,
    RefreshTokenService,
} from './token'

export class AuthTokenError extends Error {}

@Injectable()
export class AuthService {
    constructor(
        private readonly accessTokenService: AccessTokenService,
        private readonly refreshTokenService: RefreshTokenService,
        private readonly refreshTokenCacheService: RefreshTokenCacheService
    ) {}

    public async generateTokens(
        emailAddress: EmailAddress
    ): Promise<AuthTokensDto> {
        const accessToken =
            await this.accessTokenService.generate(emailAddress)

        const refreshToken =
            await this.refreshTokenService.generate(emailAddress)

        await this.refreshTokenCacheService.saveRefreshToken(
            refreshToken,
            emailAddress
        )

        return new AuthTokensDto(accessToken, refreshToken)
    }

    public async invalidateRefreshToken(refreshToken: string) {
        await this.refreshTokenCacheService.deleteRefreshToken(refreshToken)
    }

    public async rotateRefreshToken(
        refreshToken: string
    ): Promise<AuthTokensDto> {
        const emailAddress =
            await this.refreshTokenCacheService.getEmailAddressFromCache(
                refreshToken
            )

        await this.invalidateRefreshToken(refreshToken)

        return await this.generateTokens(emailAddress)
    }

    public async getEmailAddressFromAccessToken(accessToken: string) {
        return await this.accessTokenService.getEmailAddress(accessToken)
    }
}
