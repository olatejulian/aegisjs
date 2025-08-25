import {DomainEvent} from '@core/shared'
import {AccountId, AccountName, EmailAddress} from '../value-object'

export interface AccountCreatedEventPayload {
    accountId: AccountId
    accountName: AccountName
    accountEmailAddress: EmailAddress
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
