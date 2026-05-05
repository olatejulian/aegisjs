import { Mail, MailService } from '@app/mail'
import { TemplateRendererService } from '@app/template-renderer'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { AccountCreatedEvent } from '@ts-api-example/core'

@Injectable()
export class AccountCreatedEventListener {
    constructor(
        private readonly mailService: MailService,
        private readonly templateRendererService: TemplateRendererService,
    ) {}

    @OnEvent(AccountCreatedEvent.EVENT_NAME)
    public async sendVerificationEmail(event: AccountCreatedEvent) {
        const { name, email, token } = event.payload()

        const verifyUrl = `http://localhost:3000/verify-email/${token}`

        const template = await this.templateRendererService.render({
            templateName: 'verification-email-address',
            data: {
                appName: 'TS-API-Example',
                name: name,
                verifyUrl: verifyUrl,
                year: new Date().getFullYear(),
            },
        })

        const mail: Mail = {
            to: email,
            subject: `Hello ${name}`,
            text: 'Hello world',
            html: template,
        }

        await this.mailService.sendEmail(mail)
    }
}
