import { Server } from 'socket.io'
import Mongo from '#apps/shared/services/mongo'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    ws: Server
    mongo: Mongo
  }
}
