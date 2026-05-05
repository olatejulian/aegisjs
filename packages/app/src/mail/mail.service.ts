import { Injectable } from '@nestjs/common'
import { Transporter, createTransport } from 'nodemailer'
import { MailConfig } from './mail.config'
import { Mail } from './mail.interface'

@Injectable()
export class MailService {
    private readonly transporter: Transporter

    constructor(private readonly mailConfig: MailConfig) {
        this.transporter = createTransport({
            host: this.mailConfig.host(),
            port: this.mailConfig.port(),
            auth: {
                user: this.mailConfig.user(),
                pass: this.mailConfig.password(),
            },
        })
    }

    public async sendEmail(mail: Mail): Promise<void> {
        await this.transporter.sendMail({
            to: mail.to.toString(),
            subject: mail.subject,
            text: mail.text,
            html: mail.html,
        })
    }
}
