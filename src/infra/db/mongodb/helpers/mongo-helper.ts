import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,

  async connect(uri: string) {
    this.uri = uri;
    this.client = await MongoClient.connect(uri);
  },

  async disconnect() {
    await this.client.close();
    this.client = null;
  },

  async getCollection(collectionName: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.uri);
    }

    return this.client.db().collection(collectionName);
  },
  map: (data: any) => {
    const { _id, ...rest } = data;
    return { ...rest, id: _id.toHexString() };
  },

  mapCollection: (collection: any[]): any[] => {
    return collection.map((c) => MongoHelper.map(c));
  },
};
