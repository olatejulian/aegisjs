import { Injectable } from '@nestjs/common'
import * as Handlebars from 'handlebars'
import { readFile } from 'node:fs/promises'
import { join } from 'path'

@Injectable()
export class TemplateRendererService {
    private readonly templatesDirectory = join(__dirname, 'templates')

    public async render<T>(input: { templateName: string; data: T }): Promise<string> {
        const { templateName, data } = input

        const templatePath = join(this.templatesDirectory, `${templateName}.hbs`)

        const templateContent = await readFile(templatePath, { encoding: 'utf8' })

        const compiledTemplate = Handlebars.compile(templateContent)

        const renderedTemplate = compiledTemplate(data)

        return renderedTemplate
    }
}
