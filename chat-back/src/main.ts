import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';

declare const module: any;

const port = 3030;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors();
  app.useWebSocketAdapter(new IoAdapter(app));
  app.setGlobalPrefix('/api');
  const config = new DocumentBuilder() //
    .setTitle('API')
    .setDescription('개발을 위한 API 문서입니다.')
    .setVersion('1.0')
    .addBasicAuth()
    .addSecurity('basic', {
      type: 'http',
      scheme: 'basic',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  console.log(`Swagger Document is ${port}/api-docs`);
}
bootstrap();
