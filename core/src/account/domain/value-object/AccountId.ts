import {v4 as uuidv4, validate} from 'uuid'

export class InvalidAccountIdError extends Error {}

export class AccountId {
    private constructor(private readonly accountId: string) {}

    public static generate(): AccountId {
        const newUniqueIdString = uuidv4().toString()

        return new AccountId(newUniqueIdString)
    }

    public static fromString(accountId: string): AccountId {
        AccountId.validate(accountId)

        return new AccountId(accountId)
    }

    public toString(): string {
        return this.accountId
    }

    public equals(other: AccountId): boolean {
        return this.toString() === other.toString()
    }

    private static validate(value: string): void {
        const isValid = validate(value)

        if (!isValid) {
            throw new InvalidAccountIdError()
        }
    }
}
