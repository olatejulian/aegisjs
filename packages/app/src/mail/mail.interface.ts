import {EmailAddress} from '@ts-api-example/core'

export interface Mail {
    to: EmailAddress
    subject: string
    text?: string
    html?: string
}
