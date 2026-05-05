import { AppModule } from '@app/app.module'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'

describe('AppController (e2e)', () => {
    let app: INestApplication

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        await app.init()
    })

    it('/ (GET)', async () => {
        const response = await request(app.getHttpServer()).get('/')
        expect(response.status).toBe(200)
        expect(response.text).toBe('Hello World!')
    })
})
