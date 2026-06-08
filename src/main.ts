import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('TypeORM DB Laboratory')
    .setDescription(
      `API para gerenciamento de **Artistas**, **Músicas** e **Playlists**.

## Regras de negócio
- **Artistas**: não podem ser removidos enquanto tiverem músicas vinculadas.
- **Músicas**: a duração em segundos deve ser **maior que 0**.
- **Busca** (retrieve): informe **id** OU **nome/titulo** — nunca os dois ao mesmo tempo.
- **Playlists**: vinculadas a um usuário existente.`,
    )
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Servidor local')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      persistAuthorization: true,
    },
    customSiteTitle: 'TypeORM Lab — Swagger UI',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
