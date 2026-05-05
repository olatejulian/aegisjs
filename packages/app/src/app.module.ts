import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { AccountModule } from './account/account.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth'
import { MailModule } from './mail'
import { TemplateRendererModule } from './template-renderer/template-renderer.module'

@Module({
    imports: [
        AccountModule,
        AuthModule,
        CacheModule.registerAsync({
            isGlobal: true,
            useFactory: () => ({
                ttl: 10,
                max: 1000,
            }),
        }),
        ConfigModule.forRoot({ isGlobal: true }),
        EventEmitterModule.forRoot(),
        MailModule,
        TemplateRendererModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
