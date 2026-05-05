import { v4 as uuidv4, validate } from 'uuid'

export class InvalidEmailVerificationTokenError extends Error {}

export class EmailVerificationToken {
    private constructor(private readonly token: string) {}

    public static generateToken(): EmailVerificationToken {
        const token = uuidv4()

        return new EmailVerificationToken(token)
    }

    public static fromString(token: string): EmailVerificationToken {
        EmailVerificationToken.validate(token)

        return new EmailVerificationToken(token)
    }

    public toString(): string {
        return this.token
    }

    public equals(other: EmailVerificationToken): boolean {
        return this.toString() === other.toString()
    }

    private static validate(token: string): void {
        if (!validate(token)) throw new InvalidEmailVerificationTokenError()
    }
}
