import { DomainEvent } from '@core/shared'
import { AccountId, AccountName, EmailAddress } from '../value-object'

export interface AccountCreatedEventPayload {
    accountId: AccountId
    accountName: AccountName
    accountEmailAddress: EmailAddress
}


export class AccountCreatedEvent extends DomainEvent<AccountCreatedEventPayload> {
    constructor(payload: AccountCreatedEventPayload) {
        super({
            eventName: "account.created",
            payload: payload
        })
    }
}
