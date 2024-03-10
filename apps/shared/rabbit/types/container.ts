import RabbitManager from '#apps/shared/rabbit/rabbit'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    rabbit: RabbitManager
  }
}
