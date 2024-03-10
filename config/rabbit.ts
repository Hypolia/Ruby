import { RabbitConfig } from '@adonisjs/rabbit/types'

export const rabbitConfig: RabbitConfig = {
  protocol: 'amqp://',
  hostname: 'localhost',
  port: 5672,
  user: 'rabbit',
  password: 'rabbit',
}
