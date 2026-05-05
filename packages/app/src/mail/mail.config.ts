import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class MailConfig {
    constructor(public readonly configService: ConfigService) {}

    public host(): string {
        return this.configService.get<string>('SMTP_MAIL_HOST')
    }

    public port(): number {
        return this.configService.get<number>('SMTP_MAIL_PORT')
    }

    public user(): string {
        return this.configService.get<string>('SMTP_MAIL_USER')
    }

    public password(): string {
        return this.configService.get<string>('SMTP_MAIL_PASSWORD')
    }
}
