import { Db, Filter, FindOptions, MongoClient, ObjectId } from 'mongodb'

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

  async insertData(collectionName: string, data: any) {
    const collection = this.#db!.collection(collectionName)
    return collection.insertOne(data)
  }

  async getData(collectionName: string, query: object = {}) {
    const collection = this.#db!.collection(collectionName)
    return collection.find(query).toArray()
  }

  async find(collectionName: string, filter: Filter<any>, options?: FindOptions) {
    const collection = this.#db!.collection(collectionName)
    return collection.find(filter, options).toArray()
  }

  async aggregate(collectionName: string, pipeline: any[]) {
    const collection = this.#db!.collection(collectionName)

    return collection.aggregate(pipeline).toArray()
  }

  async findById(collectionName: string, id: string) {
    const collection = this.#db!.collection(collectionName)

    return collection.findOne({ _id: new ObjectId(id) })
  }

  async deleteById(collectionName: string, id: string) {
    const collection = this.#db!.collection(collectionName)

    return collection.deleteOne({ _id: new ObjectId(id) })
  }
}
