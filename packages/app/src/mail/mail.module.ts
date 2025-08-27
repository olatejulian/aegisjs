import {Module} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {MailConfig} from './mail.config'
import {MailService} from './mail.service'

@Module({
    providers: [ConfigService, MailConfig, MailService],
    exports: [MailConfig, MailService],
})
export class MailModule {}
