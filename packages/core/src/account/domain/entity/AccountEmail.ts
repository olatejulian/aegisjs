import {EmailAddress, EmailVerificationToken} from '../value-object'

export class AccountEmailCorruptedStateError extends Error {}

export class CantVerifyEmailError extends Error {}

export class EmailAlreadyVerifiedError extends Error {}

export type AccountEmailObject = {
    emailAddress: EmailAddress
    token: EmailVerificationToken
    tokenExpiresAt: Date
    verifiedAt: Date
}

export class AccountEmail {
    private static readonly TOKEN_EXPIRATION_TIME_IN_MS = 1800000

    private constructor(
        private readonly emailAddress: EmailAddress,
        private token: EmailVerificationToken,
        private tokenExpiresAt: Date,
        private verifiedAt: Date
    ) {}

    public static create(emailAddress: EmailAddress): AccountEmail {
        const accountEmail = new AccountEmail(emailAddress, null, null, null)

        accountEmail.setInitialState()

        return accountEmail
    }

    public static fromObject(obj: AccountEmailObject): AccountEmail {
        const {emailAddress, verifiedAt, token, tokenExpiresAt} = obj

        AccountEmail.getStatus(token, tokenExpiresAt, verifiedAt)

        return new AccountEmail(
            emailAddress,
            token,
            tokenExpiresAt,
            verifiedAt
        )
    }

    public toObject(): AccountEmailObject {
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

    public isAlreadyVerified(): boolean {
        return !this.token && !this.tokenExpiresAt && !!this.verifiedAt
    }

    public generateToken(): EmailVerificationToken {
        const token = EmailVerificationToken.generateToken()

        const tokenExpiresAt = new Date(
            Date.now() + AccountEmail.TOKEN_EXPIRATION_TIME_IN_MS
        )

        this.setInVerificationState(token, tokenExpiresAt)

        return this.token
    }

    public verify(token: EmailVerificationToken): void {
        if (this.isAlreadyVerified()) throw new EmailAlreadyVerifiedError()

        const isTokenExpired =
            this.tokenExpiresAt && this.tokenExpiresAt.getTime() <= Date.now()

        const isTheSameToken = this.token && this.token.equals(token)

        if (isTokenExpired || !isTheSameToken) throw new CantVerifyEmailError()

        const verifiedAt = new Date()

        this.setVerifiedState(verifiedAt)
    }

    private static getStatus(
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
        if (this.isAlreadyVerified()) throw new EmailAlreadyVerifiedError()

        this.token = null
        this.tokenExpiresAt = null
        this.verifiedAt = null
    }

    private setInVerificationState(
        token: EmailVerificationToken,
        tokenExpiresAt: Date
    ): void {
        if (this.isAlreadyVerified()) throw new EmailAlreadyVerifiedError()

        this.token = token
        this.tokenExpiresAt = tokenExpiresAt
        this.verifiedAt = null
    }

    private setVerifiedState(verifiedAt: Date): void {
        if (this.isAlreadyVerified()) throw new EmailAlreadyVerifiedError()

        this.token = null
        this.tokenExpiresAt = null
        this.verifiedAt = verifiedAt
    }
}
