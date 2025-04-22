import validator from 'validator'

export class InvalidEmailAddressError extends Error {}

export class EmailAddress {
    private constructor(private readonly emailAddress: string) {}

    public static create(emailAddress: string): EmailAddress {
        EmailAddress.validate(emailAddress)

        return new EmailAddress(emailAddress)
    }

    public equals(other: EmailAddress): boolean {
        return this.toString() === other?.toString()
    }

    public toString(): string {
        return this.emailAddress
    }

    private static validate(value: string): void {
        const isEmailValid = validator.isEmail(value)

        if (!isEmailValid) {
            throw new InvalidEmailAddressError()
        }
    }
}
