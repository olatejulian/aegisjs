import {AggregateRoot} from '@core/shared'
import {AccountCreatedEvent} from '../event'
import {
    AccountId,
    AccountName,
    EmailAddress,
    EmailVerificationToken,
    Password,
    PasswordResetToken,
} from '../value-object'
import {AccountEmailManager} from './account-email-manager'
import {AccountPasswordManager} from './account-password-manager'

export class WrongEmailAddressOrPasswordError extends Error {}

export interface AccountProperties {
    id: AccountId
    name: AccountName
    email: AccountEmailManager
    password: AccountPasswordManager
    createdAt: Date
    updatedAt: Date
}

export class Account extends AggregateRoot {
    private constructor(
        private readonly accountId: AccountId,
        private accountName: AccountName,
        private readonly accountEmailManager: AccountEmailManager,
        private readonly accountPasswordManager: AccountPasswordManager,
        private readonly accountCreatedAt: Date,
        private accountUpdatedAt?: Date
    ) {
        super()
    }

    public static create(
        name: AccountName,
        email: AccountEmailManager,
        password: AccountPasswordManager
    ) {
        const id = AccountId.generate()

        const createdAt = new Date()

        const account = new Account(id, name, email, password, createdAt)

        const accountCreatedEvent = new AccountCreatedEvent({
            accountId: account.getId(),
            accountName: account.getName(),
            accountEmailAddress: email.getEmailAddress(),
        })

        account.addDomainEvent(accountCreatedEvent)

        return account
    }

    public static recreate(props: AccountProperties) {
        const {id, name, email, password, createdAt, updatedAt} = props

        return new Account(id, name, email, password, createdAt, updatedAt)
    }

    public toObject() {
        return {
            id: this.accountId,
            name: this.accountName,
            email: this.accountEmailManager,
            password: this.accountPasswordManager,
            createdAt: this.accountCreatedAt,
            updatedAt: this.accountUpdatedAt,
        }
    }

    public getId(): AccountId {
        return this.accountId
    }

    public getName(): AccountName {
        return this.accountName
    }

    public getEmailAddress(): EmailAddress {
        return this.accountEmailManager.getEmailAddress()
    }

    public changeName(name: AccountName) {
        this.accountName = name

        this.accountUpdated()
    }

    public generateEmailAddressVerificationToken(): EmailVerificationToken {
        const token = this.accountEmailManager.generateVerificationToken()

        this.accountUpdated()

        return token
    }

    public verifyEmailAddress(token: EmailVerificationToken): void {
        this.accountEmailManager.verifyEmailAddress(token)

        this.accountUpdated()
    }

    public isEmailAddressVerified(): boolean {
        return this.accountEmailManager.isEmailAddressVerified()
    }

    public async comparePassword(plainPassword: string): Promise<boolean> {
        return await this.accountPasswordManager.comparePassword(plainPassword)
    }

    public changePassword(oldPassword: Password, newPassword: Password): void {
        this.accountPasswordManager.changePassword(oldPassword, newPassword)

        this.accountUpdated()
    }

    public generatePasswordResetToken(): PasswordResetToken {
        const token = this.accountPasswordManager.generateResetToken()

        return token
    }

    public resetPassword(
        newPassword: Password,
        token: PasswordResetToken
    ): void {
        this.accountPasswordManager.resetPassword(newPassword, token)

        this.accountUpdated()
    }

    private accountUpdated(): void {
        this.accountUpdatedAt = new Date()
    }
}
