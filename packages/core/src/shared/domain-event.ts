export abstract class DomainEvent<Payload> {
    private readonly eventOccurredAt: Date

    protected constructor(
        private readonly props: {
            eventName: string
            payload: Payload
        }
    ) {
        this.eventOccurredAt = new Date()
    }

    public name(): string {
        return this.props.eventName
    }

    public occurredAt(): Date {
        return this.eventOccurredAt
    }

    public payload(): Payload {
        return this.props.payload
    }
}
