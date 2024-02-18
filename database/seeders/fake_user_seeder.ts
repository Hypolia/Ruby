import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#apps/users/models/user'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method

    await User.create({
      id: '804dfcf4-7f2a-4636-acb1-b9ed3c54acd1',
      email: 'pro.nathaelbonnal@gmail.com',
      firstname: 'Nathael',
      lastname: 'Bonnal',
      username: 'nathaelb'
    })
  }
}
