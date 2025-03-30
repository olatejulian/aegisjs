import * as bcrypt from 'bcrypt'

export class InvalidPasswordError extends Error {}

export class Password {
    private static readonly MIN_LENGTH = 12
    private static readonly MAX_LENGTH = 64
    private static readonly SALT_ROUNDS = 10

    private constructor(private readonly password: string) {}

    public static async create(password: string): Promise<Password> {
        Password.validate(password)

        const hashedPassword = await bcrypt.hash(
            password,
            Password.SALT_ROUNDS
        )

        return new Password(hashedPassword)
    }

    public async compare(plainTextPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainTextPassword, this.password)
    }

    private static validate(value: string): void {
        if (
            !Password.mustBeDefinedString(value) ||
            !Password.passwordMustBeAtLeastXCharacters(value) ||
            !Password.passwordMustBeAtMostXCharacters(value) ||
            !Password.passwordMustBeValidFormat(value)
        ) {
            throw new InvalidPasswordError()
        }
    }

    private static mustBeDefinedString(value: string): boolean {
        return (
            value !== undefined && value !== null && typeof value === 'string'
        )
    }

    private static passwordMustBeAtLeastXCharacters(value: string): boolean {
        return value.length >= Password.MIN_LENGTH
    }

    private static passwordMustBeAtMostXCharacters(value: string): boolean {
        return value.length <= Password.MAX_LENGTH
    }

    private static passwordMustBeValidFormat(value: string): boolean {
        return (
            /[A-Z]/.test(value) &&
            /[a-z]/.test(value) &&
            /\d/.test(value) &&
            /[!@#$%^&*()_+{}\\[\]:;<>,.?~]/.test(value)
        )
    }
}
