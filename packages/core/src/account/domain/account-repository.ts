import { Account } from './entity'
import { AccountId, EmailAddress } from './value-object'

export interface AccountRepository {
    save(account: Account): Promise<void>
    findById(id: AccountId): Promise<Account | null>
    findByEmail(email: EmailAddress): Promise<Account | null>
    delete(account: Account): Promise<void>
}
