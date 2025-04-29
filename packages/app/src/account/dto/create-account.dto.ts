import {ApiProperty} from '@nestjs/swagger'

export class CreateAccountDto {
    @ApiProperty({example: 'John Doe'})
    public readonly name: string

    @ApiProperty({example: 'john.doe@email.com'})
    public readonly email: string

    @ApiProperty({example: 'JohnDoe123!@#'})
    public readonly password: string

    constructor(input: {name: string; email: string; password: string}) {
        const {name, email, password} = input

        this.name = name
        this.email = email
        this.password = password
    }
}
