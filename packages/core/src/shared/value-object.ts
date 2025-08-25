export class ValueObject<ValueType> {
    protected constructor(protected readonly _value: ValueType) {}

    public value(): ValueType {
        return this._value
    }

    public equals(other: ValueObject<ValueType>): boolean {
        return this.value === other.value
    }
}
