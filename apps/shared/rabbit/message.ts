import { MessageContract } from '@adonisjs/rabbit/types'
import { Channel, ConsumeMessage } from 'amqplib'

export default class Message implements MessageContract {
  message: ConsumeMessage
  #channel: Channel

  constructor(channel: Channel, message: ConsumeMessage | null) {
    if (message === null) {
      throw new Error('Message is null')
    }

    this.#channel = channel
    this.message = message
  }

  ack(allUpTo = false) {
    this.#channel.ack(this.message, allUpTo)
  }

  nack(allUpTo = false, requeue = true) {
    this.#channel.nack(this.message, allUpTo, requeue)
  }

  reject(requeue = true) {
    this.#channel.reject(this.message, requeue)
  }

  get content() {
    return this.message.content.toString()
  }

  get fields() {
    return this.message.fields
  }

  get properties() {
    return this.message.properties
  }
}
