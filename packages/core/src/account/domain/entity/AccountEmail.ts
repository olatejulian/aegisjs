import {EmailAddress, EmailVerificationToken} from '../value-object'

export class AccountEmailCorruptedStateError extends Error {}

export class CantVerifyEmailError extends Error {}

export class EmailAlreadyVerifiedError extends Error {}

export type AccountEmailManagerObject = {
    emailAddress: EmailAddress
    token: EmailVerificationToken
    tokenExpiresAt: Date
    verifiedAt: Date
}

export class AccountEmailManager {
    private static readonly TOKEN_EXPIRATION_TIME_IN_MS = 1800000

    private constructor(
        private readonly emailAddress: EmailAddress,
        private token: EmailVerificationToken,
        private tokenExpiresAt: Date,
        private verifiedAt: Date
    ) {}

    public static create(emailAddress: EmailAddress): AccountEmailManager {
        const accountEmail = new AccountEmailManager(
            emailAddress,
            null,
            null,
            null
        )

        accountEmail.setInitialState()

        return accountEmail
    }

    public static fromObject(
        obj: AccountEmailManagerObject
    ): AccountEmailManager {
        const {emailAddress, verifiedAt, token, tokenExpiresAt} = obj

        AccountEmailManager.validateState(token, tokenExpiresAt, verifiedAt)

        return new AccountEmailManager(
            emailAddress,
            token,
            tokenExpiresAt,
            verifiedAt
        )
    }

    public toObject(): AccountEmailManagerObject {
        return {
            emailAddress: this.emailAddress,
            token: this.token,
            tokenExpiresAt: this.tokenExpiresAt,
            verifiedAt: this.verifiedAt,
        }
    }

    public getEmailAddress(): EmailAddress {
        return this.emailAddress
    }

    public isEmailAddressVerified(): boolean {
        return !this.token && !this.tokenExpiresAt && !!this.verifiedAt
    }

    public generateEmailAddressVerificationToken(): EmailVerificationToken {
        const token = EmailVerificationToken.generateToken()

        const tokenExpiresAt = new Date(
            Date.now() + AccountEmailManager.TOKEN_EXPIRATION_TIME_IN_MS
        )

        this.setInVerificationState(token, tokenExpiresAt)

        return this.token
    }

    public verifyEmailAddress(token: EmailVerificationToken): void {
        if (this.isEmailAddressVerified())
            throw new EmailAlreadyVerifiedError()

        const isTokenExpired =
            this.tokenExpiresAt && this.tokenExpiresAt.getTime() <= Date.now()

        const isTheSameToken = this.token && this.token.equals(token)

        if (isTokenExpired || !isTheSameToken) throw new CantVerifyEmailError()

        const verifiedAt = new Date()

        this.setVerifiedState(verifiedAt)
    }

    private static validateState(
        token: EmailVerificationToken,
        tokenExpiresAt: Date,
        verifiedAt: Date
    ): void {
        const initialState = !token && !tokenExpiresAt && !verifiedAt

        const inVerificationState = token && tokenExpiresAt && !verifiedAt

        const verifiedState = !token && !tokenExpiresAt && verifiedAt

        if (!(initialState || inVerificationState || verifiedState))
            throw new AccountEmailCorruptedStateError()
    }

    private setInitialState(): void {
        if (this.isEmailAddressVerified())
            throw new EmailAlreadyVerifiedError()

        this.token = null
        this.tokenExpiresAt = null
        this.verifiedAt = null
    }

    private setInVerificationState(
        token: EmailVerificationToken,
        tokenExpiresAt: Date
    ): void {
        if (this.isEmailAddressVerified())
            throw new EmailAlreadyVerifiedError()

        this.token = token
        this.tokenExpiresAt = tokenExpiresAt
        this.verifiedAt = null
    }

    private setVerifiedState(verifiedAt: Date): void {
        if (this.isEmailAddressVerified())
            throw new EmailAlreadyVerifiedError()

        this.token = null
        this.tokenExpiresAt = null
        this.verifiedAt = verifiedAt
    }
}
