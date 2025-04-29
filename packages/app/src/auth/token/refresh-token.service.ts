import {JwtService} from '@nestjs/jwt'
import {EmailAddress} from '@ts-api-example/core'
import {AuthConfigWrapper} from '../auth-config.wrapper'

export class RefreshTokenService {
    private static readonly AUDIENCE = 'urn:auth:web:refresh'

    private static readonly ISSUER = 'urn:auth:server:refresh'

    constructor(
        private readonly jwtService: JwtService,
        private readonly authConfig: AuthConfigWrapper
    ) {}

    public async generate(emailAddress: EmailAddress): Promise<string> {
        const sub = emailAddress.toString()

        const expiresIn = `${this.authConfig.getRefreshTokenDurationMinutes()}m`

        const refreshToken = await this.jwtService.signAsync(
            {
                sub: sub,
            },
            {
                audience: RefreshTokenService.AUDIENCE,
                issuer: RefreshTokenService.ISSUER,
                expiresIn: expiresIn,
            }
        )

        return refreshToken
    }

    public async getEmailAddress(refreshToken: string): Promise<EmailAddress> {
        const payload = await this.jwtService.verifyAsync<{sub: string}>(
            refreshToken,
            {
                audience: RefreshTokenService.AUDIENCE,
                issuer: RefreshTokenService.ISSUER,
            }
        )

        const emailAddress = EmailAddress.create(payload.sub)

        return emailAddress
    }
}
