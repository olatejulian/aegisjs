import { DomainEvent } from '@core/shared'
import { AccountName, EmailAddress, EmailVerificationToken } from '../value-object'

export interface AccountCreatedEventPayload {
    name: AccountName
    email: EmailAddress
    token: EmailVerificationToken
}

export class AccountCreatedEvent extends DomainEvent<AccountCreatedEventPayload> {
    public static EVENT_NAME = 'account.created'

    constructor(payload: AccountCreatedEventPayload) {
        super({
            eventName: AccountCreatedEvent.EVENT_NAME,
            payload: payload,
        })
    }
}
