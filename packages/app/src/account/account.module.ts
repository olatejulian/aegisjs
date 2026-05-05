import { MailModule, MailService } from '@app/mail'
import { TemplateRendererModule, TemplateRendererService } from '@app/template-renderer'
import { Module } from '@nestjs/common'
import { AccountRepository } from '@ts-api-example/core'
import { AccountController } from './account.controller'
import { AccountService } from './account.service'
import { AccountCreatedEventListener } from './listener'
import { InMemoryAccountRepository } from './repository'

@Module({
    imports: [MailModule, TemplateRendererModule],
    controllers: [AccountController],
    providers: [
        {
            provide: AccountService,
            useFactory: (repository: AccountRepository) => new AccountService(repository),
            inject: [InMemoryAccountRepository],
        },
        AccountCreatedEventListener,
        InMemoryAccountRepository,
        MailService,
        TemplateRendererService,
    ],
})
export class AccountModule {}
