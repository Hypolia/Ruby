import { Channel, type Connection, Options, Replies } from 'amqplib'

declare module '@adonisjs/rabbit/types' {
  export interface RabbitManagerContract {
    hasChannel: boolean
    getConnection(): Promise<Connection>
    getChannel(): Promise<Channel>
    sendToQueue(queueName: string, content: any, options?: Options.Publish): Promise<boolean>
    consumeFrom<T extends object = any>(
      queueName: string,
      onMessage: (msg: any) => void | Promise<void>
    ): Promise<Replies.Consume>
  }

  export interface RabbitConfig {
    user?: string
    password?: string
    hostname: string
    port?: number
    protocol?: string
  }

  export interface MessageContract {}
}