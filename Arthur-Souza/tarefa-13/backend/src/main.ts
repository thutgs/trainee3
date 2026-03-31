import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, // Remove campos que não estão no DTO
    forbidNonWhitelisted: true, // Retorna erro se enviarem campos não permitidos
    transform: true, // Converte os tipos de dados automaticamente
  }));

  app.enableCors(); // CORS significa Cross-Origin Resource Sharing, Compartilhamento de recursos de origem cruzada,
  //  permitindo que o frontend acesse a API mesmo estando em domínios diferentes (localhost:3000 para o backend e localhost:4200
  //  para o frontend, por exemplo).

  // Isso é necessário por conta da política de mesma origem dos navegadores, que bloqueia requisições feitas por scripts 
  // de um domínio para outro domínio diferente, a menos que o servidor permita explicitamente essas requisições. 

  // A política foi criada para impedir que um site malicioso roube dados de uma sessão aberta em outro site.

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
