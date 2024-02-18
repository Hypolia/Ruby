import {Db, MongoClient} from "mongodb";

export default class Mongo {
  #client: MongoClient
  #db?: Db

  constructor(uri: string) {
    this.#client = new MongoClient(uri)
  }

  async init(dbName: string) {
    await this.#client.connect()
    this.#db = this.#client.db(dbName)
  }

  setDb(dbName: string) {
    this.#db = this.#client.db(dbName)
  }

  async getCollections() {
    return this.#db!.listCollections().toArray()
  }
}
