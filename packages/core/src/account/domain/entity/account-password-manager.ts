import { Password, PasswordResetToken } from '../value-object'

export class CannotGenerateResetTokenError extends Error {}

export class CannotChangePasswordError extends Error {}

export class CannotResetPasswordError extends Error {}

export type AccountPasswordManagerObject = {
    password: Password
    passwordUpdatedAt?: Date
    resetToken?: PasswordResetToken
    tokenExpiresAt?: Date
}

export class AccountPasswordManager {
    private static readonly TOKEN_TIMEOUT = 1800000

    private constructor(
        private password: Password,
        private passwordUpdatedAt?: Date,
        private resetToken?: PasswordResetToken,
        private tokenExpiresAt?: Date,
    ) {}

    public static create(password: Password): AccountPasswordManager {
        return new AccountPasswordManager(password)
    }

    public static fromObject(obj: AccountPasswordManagerObject): AccountPasswordManager {
        const { password, passwordUpdatedAt, resetToken, tokenExpiresAt } = obj

        return new AccountPasswordManager(password, passwordUpdatedAt, resetToken, tokenExpiresAt)
    }

    public toObject(): AccountPasswordManagerObject {
        return {
            password: this.password,
            passwordUpdatedAt: this.passwordUpdatedAt,
            resetToken: this.resetToken,
            tokenExpiresAt: this.tokenExpiresAt,
        }
    }

    public async comparePassword(plainPassword: string): Promise<boolean> {
        return this.password.compare(plainPassword)
    }

    public changePassword(oldPassword: Password, newPassword: Password): void {
        const isEqual = this.password.equals(oldPassword)

        if (!isEqual) throw new CannotResetPasswordError()

        this.updatePassword(newPassword)
    }

    public generateResetToken(): PasswordResetToken {
        if (this.tokenExpiresAt && this.tokenExpiresAt >= new Date())
            throw new CannotGenerateResetTokenError()

        const token = PasswordResetToken.generateToken()

        const expiresAt = new Date(Date.now() + AccountPasswordManager.TOKEN_TIMEOUT)

        this.resetToken = token

        this.tokenExpiresAt = expiresAt

        return token
    }

    public resetPassword(newPassword: Password, token: PasswordResetToken): void {
        const isEqual = this.resetToken && this.resetToken.equals(token)

        const isExpired = this.tokenExpiresAt && this.tokenExpiresAt <= new Date()

        if (!isEqual || isExpired) throw new CannotResetPasswordError()

        this.updatePassword(newPassword)
    }

    private updatePassword(newPassword: Password): void {
        this.password = newPassword

        this.passwordUpdatedAt = new Date()

        this.resetToken = null

        this.tokenExpiresAt = null
    }
}
