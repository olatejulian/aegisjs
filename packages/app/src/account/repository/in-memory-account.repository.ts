import {
    Account,
    AccountId,
    AccountRepository,
    EmailAddress,
} from '@ts-api-example/core'

export class InMemoryAccountRepository implements AccountRepository {
    accounts: Account[]

    constructor() {
        this.accounts = []
    }

    public async save(account: Account): Promise<void> {
        this.accounts.push(account)
    }

    public async findById(id: AccountId): Promise<Account | null> {
        const account = this.accounts.find(a => a.getId().equals(id)) || null

        return account
    }

    public async findByEmail(email: EmailAddress): Promise<Account | null> {
        const account =
            this.accounts.find(a => a.getEmailAddress().equals(email)) || null

        return account
    }

    public async delete(account: Account): Promise<void> {
        this.accounts = this.accounts.filter(
            a => !a.getId().equals(account.getId())
        )
    }
}
