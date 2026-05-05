import { EmailAddress } from '@ts-api-example/core'
import * as cacheManager from 'cache-manager'
import { createHmac } from 'crypto'
import { AuthConfigWrapper } from '../auth-config.wrapper'

export class RefreshTokenCacheService {
    constructor(
        private readonly authConfig: AuthConfigWrapper,
        private readonly cacheService: cacheManager.Cache,
    ) {}

    public async saveRefreshToken(refreshToken: string, emailAddress: EmailAddress) {
        const hashedRefreshToken = this.hashRefreshToken(refreshToken)

        const ttl = 60000 * this.authConfig.getRefreshTokenCacheDurationMinutes()

        await this.cacheService.set(hashedRefreshToken, emailAddress.toString(), ttl)
    }

    public async deleteRefreshToken(refreshToken: string): Promise<void> {
        const hashedRefreshToken = this.hashRefreshToken(refreshToken)

        await this.cacheService.del(hashedRefreshToken)
    }

    public async getEmailAddressFromCache(refreshToken: string): Promise<EmailAddress> {
        const hashedRefreshToken = this.hashRefreshToken(refreshToken)

        const emailAddressString = await this.cacheService.get<string>(hashedRefreshToken)

        const emailAddress = EmailAddress.create(emailAddressString)

        return emailAddress
    }

    private hashRefreshToken(refreshToken: string): string {
        const ALGORITHM = 'sha256'

        const tokenSecret = this.authConfig.getJwtTokenSecret()

        const ENCODE = 'hex'

        const hashedRefreshToken = createHmac(ALGORITHM, tokenSecret)
            .update(refreshToken)
            .digest(ENCODE)

        return hashedRefreshToken
    }
}
