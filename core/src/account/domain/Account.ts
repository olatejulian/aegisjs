import {AccountEmail} from './AccountEmail'
import {AccountPassword} from './AccountPassword'
import {
    AccountId,
    AccountName,
    EmailAddress,
    EmailVerificationToken,
    Password,
    PasswordResetToken,
} from './value-object'

export class WrongEmailAddressOrPasswordError extends Error {}

export type AccountObject = {
    id: AccountId
    name: AccountName
    email: AccountEmail
    password: AccountPassword
    createdAt: Date
    updatedAt: Date
}

export class Account {
    private constructor(
        private readonly accountId: AccountId,
        private accountName: AccountName,
        private readonly accountEmail: AccountEmail,
        private readonly accountPassword: AccountPassword,
        private readonly accountCreatedAt: Date,
        private accountUpdatedAt?: Date
    ) {}

    public static create(
        name: AccountName,
        email: AccountEmail,
        password: AccountPassword
    ) {
        const id = AccountId.generate()

        const createdAt = new Date()

        return new Account(id, name, email, password, createdAt)
    }

    public static fromObject(obj: AccountObject) {
        const {id, name, email, password, createdAt, updatedAt} = obj

        return new Account(id, name, email, password, createdAt, updatedAt)
    }

    public toObject(): AccountObject {
        return {
            id: this.accountId,
            name: this.accountName,
            email: this.accountEmail,
            password: this.accountPassword,
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
        return this.accountEmail.getEmailAddress()
    }

    public changeName(name: AccountName) {
        this.accountName = name

        this.accountUpdated()
    }

    public generateEmailVerificationToken(): EmailVerificationToken {
        const token = this.accountEmail.generateToken()

        return token
    }

    public verifyEmail(token: EmailVerificationToken): void {
        this.accountEmail.verify(token)

        this.accountUpdated()
    }

    public isEmailVerified(): boolean {
        return this.accountEmail.isAlreadyVerified()
    }

    public async verifyPlainPassword(plainPassword: string): Promise<void> {
        const isEqual =
            await this.accountPassword.verifyPlainPassword(plainPassword)

        if (!isEqual) throw new WrongEmailAddressOrPasswordError()
    }

    public changePassword(oldPassword: Password, newPassword: Password): void {
        this.accountPassword.changePassword(oldPassword, newPassword)

        this.accountUpdated()
    }

    public generatePasswordResetToken(): PasswordResetToken {
        const token = this.accountPassword.generateResetToken()

        return token
    }

    public resetPassword(
        newPassword: Password,
        token: PasswordResetToken
    ): void {
        this.accountPassword.resetPassword(newPassword, token)

        this.accountUpdated()
    }

    private accountUpdated(): void {
        this.accountUpdatedAt = new Date()
    }
}
