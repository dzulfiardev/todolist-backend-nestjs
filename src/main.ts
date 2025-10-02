import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use Socket.IO adapter
  app.useWebSocketAdapter(new IoAdapter(app));

  // Enable CORS for HTTP and WebSocket
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'https://todolist.dzulfikardev.site',
      'https://todolistapinest.dzulfikardev.site',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('TodoList REST API')
    .setDescription('A comprehensive TodoList API with CRUD operations, charts, Excel export, and real-time updates')
    .setVersion('2.0')
    .addTag('Todo Lists', 'Todo list CRUD operations with real-time updates')
    .addTag('Charts', 'Chart and statistics endpoints')
    .addTag('Reports', 'Export and reporting functionality')
    .addTag('WebSocket', 'Real-time todo list updates via Socket.IO')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 TodoList API is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
  console.log(`🔌 WebSocket endpoint: ws://localhost:${port}/todos`);
  console.log(`🌐 Public WebSocket: wss://todolistapinest.dzulfikardev.site/todos`);
}
bootstrap();
