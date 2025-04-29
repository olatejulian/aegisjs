import {ConfigService} from '@nestjs/config'

export class AuthConfigWrapper {
    constructor(private readonly configService: ConfigService) {}

    public getJwtTokenSecret(): string {
        return this.configService.get<string>('AUTH_JWT_TOKEN_SECRET')
    }

    public getAccessTokenDurationMinutes(): number {
        return this.configService.get<number>(
            'AUTH_ACCESS_TOKEN_DURATION_MINUTES'
        )
    }

    public getRefreshTokenDurationMinutes(): number {
        return this.configService.get<number>(
            'AUTH_REFRESH_TOKEN_DURATION_MINUTES'
        )
    }

    public getRefreshTokenCacheDurationMinutes(): number {
        return this.configService.get<number>(
            'AUTH_REFRESH_TOKEN_CACHE_DURATION_MINUTES'
        )
    }
}
