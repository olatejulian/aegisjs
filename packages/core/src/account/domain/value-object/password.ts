import * as bcrypt from 'bcrypt'

export class InvalidPasswordError extends Error {}

export class Password {
    private constructor(private readonly password: HashedPassword) {}

    public static async fromPlainString(password: string): Promise<Password> {
        const plainPassword = PlainPassword.fromPlainString(password)

        const hashedPassword = await plainPassword.hash()

        return new Password(hashedPassword)
    }

    public static fromHashedString(password: string): Password {
        const state = HashedPassword.fromHashedString(password)

        return new Password(state)
    }

    public toString(): string {
        return this.password.toString()
    }

    public async compare(plainTextPassword: string): Promise<boolean> {
        return await this.password.compare(plainTextPassword)
    }

    public equals(other: Password): boolean {
        return this.password.toString() === other.toString()
    }
}

class PlainPassword {
    private static readonly MIN_LENGTH = 12
    private static readonly MAX_LENGTH = 64
    private static readonly SALT_ROUNDS = 10

    private constructor(private readonly password: string) {}

    public static fromPlainString(password: string): PlainPassword {
        PlainPassword.validate(password)

        return new PlainPassword(password)
    }

    public async hash(): Promise<HashedPassword> {
        const hashedPassword = await bcrypt.hash(this.password, PlainPassword.SALT_ROUNDS)

        return HashedPassword.fromHashedString(hashedPassword)
    }

    private static validate(password: string) {
        const passwordMustBeInLengthRange =
            password.length >= PlainPassword.MIN_LENGTH &&
            password.length <= PlainPassword.MAX_LENGTH

        const passwordMustBeValidFormat =
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /\d/.test(password) &&
            /[!@#$%^&*()_+{}\\[\]:;<>,.?~]/.test(password)

        if (!(passwordMustBeInLengthRange && passwordMustBeValidFormat))
            throw new InvalidPasswordError()
    }
}

class HashedPassword {
    private static readonly BCRYPT_HASH_REGEX = new RegExp(
        /^\$2[aby]?\$\d{2}\$[./A-Za-z0-9]{53}$/,
        'u',
    )

    private constructor(private readonly password: string) {}

    public static fromHashedString(password: string): HashedPassword {
        HashedPassword.validate(password)

        return new HashedPassword(password)
    }

    public toString(): string {
        return this.password
    }

    public async compare(plainTextPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainTextPassword, this.password)
    }

    private static validate(password: string): void {
        if (!HashedPassword.BCRYPT_HASH_REGEX.test(password)) throw new InvalidPasswordError()
    }
}
