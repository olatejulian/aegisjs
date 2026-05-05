import { DomainEvent } from './domain-event'

export class AggregateRoot {
    private readonly domainEvents: DomainEvent<unknown>[] = []

    public getDomainEvents(): DomainEvent<unknown>[] {
        const events = [...this.domainEvents]

        this.domainEvents.length = 0

        return events
    }

    protected addDomainEvent<P>(domainEvent: DomainEvent<P>): void {
        this.domainEvents.push(domainEvent)
    }
}
