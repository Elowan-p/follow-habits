import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { EVENT_BUS } from '../src/core/event/event-bus.port';
import { UserRegisteredEvent } from '../src/context/auth/event/user-registered.event';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const eventBus = app.get(EVENT_BUS);

  console.log('Publishing UserRegisteredEvent...');
  await eventBus.publish(
    UserRegisteredEvent.create({
      email: 'test-user@example.com',
      id: '123',
      username: 'Toto',
    }),
  );

  // Wait a bit for async handlers
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  console.log('Done.');
  await app.close();
}

bootstrap();
