import {JwtService} from '@nestjs/jwt'
import {EmailAddress} from '@ts-api-example/core'
import {AuthConfigWrapper} from '../auth-config.wrapper'

export class AccessTokenService {
    private static readonly AUDIENCE = 'urn:auth:web:access'

    private static readonly ISSUER = 'urn:auth:server:access'

    constructor(
        private readonly jwtService: JwtService,
        private readonly authConfig: AuthConfigWrapper
    ) {}

    public async generate(emailAddress: EmailAddress): Promise<string> {
        const sub = emailAddress.toString()

        const expiresIn = `${this.authConfig.getAccessTokenDurationMinutes()}m`

        const accessToken = await this.jwtService.signAsync(
            {
                sub: sub,
            },
            {
                audience: AccessTokenService.AUDIENCE,
                issuer: AccessTokenService.ISSUER,
                expiresIn: expiresIn,
            }
        )

        return accessToken
    }

    public async getEmailAddress(accessToken: string): Promise<EmailAddress> {
        const payload = await this.jwtService.verifyAsync<{sub: string}>(
            accessToken,
            {
                audience: AccessTokenService.AUDIENCE,
                issuer: AccessTokenService.ISSUER,
            }
        )

        const emailAddress = EmailAddress.create(payload.sub)

        return emailAddress
    }
}
