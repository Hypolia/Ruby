import { RabbitConfig, RabbitManagerContract } from '@adonisjs/rabbit/types'
import RabbitConnection from './rabbit_connection.js'
import { Channel, Connection, Options, Replies } from 'amqplib'

export default class RabbitManager implements RabbitManagerContract {
  private readonly rabbitConnection: RabbitConnection
  hasChannel: boolean = false

  #channelPromise?: Promise<Channel>
  #channel?: Channel

  constructor(rabbitConfig: RabbitConfig) {
    this.rabbitConnection = new RabbitConnection(rabbitConfig)
  }

  private toBuffer(content: string | object | Buffer): Buffer {
    if (typeof content === 'string') {
      // Si le contenu est une chaîne, convertissez-la en Buffer
      return Buffer.from(content)
    } else if (content instanceof Buffer) {
      // Si le contenu est déjà un Buffer, retournez-le tel quel
      return content
    } else if (typeof content === 'object') {
      // Si le contenu est un objet, convertissez-le en Buffer en le transformant en JSON
      const jsonString = JSON.stringify(content)
      return Buffer.from(jsonString)
    } else {
      // Si le type n'est pas pris en charge, lancez une erreur ou adoptez un comportement par défaut
      throw new Error('Type de contenu non pris en charge')
    }
  }

  async getConnection(): Promise<Connection> {
    return this.rabbitConnection.getConnection()
  }

  async getChannel(): Promise<Channel> {
    const connection = await this.rabbitConnection.getConnection()

    if (!this.hasChannel || this.#channel) {
      if (!this.#channelPromise) {
        this.#channelPromise = connection.createChannel()
      }
      this.#channel = await this.#channelPromise
      this.hasChannel = true
    }

    return this.#channel!
  }

  async sendToQueue(queueName: string, content: any, options?: Options.Publish) {
    const channel = await this.getChannel()

    return channel.sendToQueue(queueName, this.toBuffer(content), options)
  }

  async consumeFrom(
    queueName: string,
    onMessage: (msg: any, channel: Channel) => void | Promise<void>
  ): Promise<Replies.Consume> {
    const channel = await this.getChannel()

    return channel.consume(queueName, (msg) => {
      onMessage(msg, channel)
    })
  }

  async closeChannel() {
    if (!this.hasChannel && this.#channel) {
      await this.#channel.close()
      this.hasChannel = false
    }
  }

  async closeConnection() {
    await this.closeChannel()
    await this.rabbitConnection.closeConnection()
  }
}
