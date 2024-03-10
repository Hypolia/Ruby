import app from '@adonisjs/core/services/app'
import RabbitManager from '#apps/shared/rabbit/rabbit'

let rabbit: RabbitManager

await app.booted(async () => {
  rabbit = await app.container.make('rabbit')

  await rabbit.getChannel()
})

export { rabbit as default }
