import { MongoClient } from 'mongodb';
import { disconnect } from 'process';

export const MongoHelper = {
  client: null as MongoClient,

  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(process.env.MONGO_URL);
  },

  async disconnect(): Promise<void> {
    await this.client.close();
  },
};
