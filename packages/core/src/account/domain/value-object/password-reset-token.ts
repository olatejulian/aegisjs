import { v4 as uuidv4, validate } from 'uuid'

export class InvalidPasswordResetTokenError extends Error {}

export class PasswordResetToken {
    private constructor(private readonly token: string) {}

    public static generateToken(): PasswordResetToken {
        return new PasswordResetToken(uuidv4())
    }

    public static fromString(token: string): PasswordResetToken {
        PasswordResetToken.validate(token)

        return new PasswordResetToken(token)
    }

    public toString(): string {
        return this.token
    }

    public equals(other: PasswordResetToken): boolean {
        return this.toString() === other.toString()
    }

    private static validate(token: string): void {
        if (!validate(token)) throw new InvalidPasswordResetTokenError()
    }
}
