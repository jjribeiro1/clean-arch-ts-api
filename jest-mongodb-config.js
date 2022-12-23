module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '6.0.1',
      skipMD5: true,
    },
    autoStart: false,
    instance: {
      dbName: 'jest',
    },
    replSet: {
      count: 1,
      storageEngine: 'wiredTiger',
    },
  },
};
