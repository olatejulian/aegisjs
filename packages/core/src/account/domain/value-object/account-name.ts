export class InvalidAccountNameError extends Error {}

export class AccountName {
    private static readonly MIN_LENGTH = 3
    private static readonly MAX_LENGTH = 50

    private constructor(private readonly accountName: string) {}

    public static create(accountName: string): AccountName {
        const formattedName = AccountName.format(accountName)

        AccountName.validate(formattedName)

        return new AccountName(formattedName)
    }

    public toString(): string {
        return this.accountName
    }

    public equals(other: AccountName): boolean {
        return this.toString() === other.toString()
    }

    private static format(name: string): string {
        return name
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase())
    }

    private static validate(accountName: string): void {
        if (
            !AccountName.mustBeValidLength(accountName) ||
            !AccountName.mustHaveValidCharacters(accountName)
        ) {
            throw new InvalidAccountNameError()
        }
    }

    private static mustBeValidLength(accountName: string): boolean {
        return (
            accountName.length >= this.MIN_LENGTH &&
            accountName.length <= this.MAX_LENGTH
        )
    }

    private static mustHaveValidCharacters(accountName: string): boolean {
        const regex = /^(?![-'])([A-Za-zÀ-ÖØ-öø-ÿ' -]+)(?<![-'])$/

        return regex.test(accountName)
    }
}
