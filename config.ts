import path from 'node:path';

const rootPath = __dirname;

const config = {
  rootPath,
  publicPath: path.join(rootPath, 'public'),
  database: 'mongodb://localhost/',
};

export default config;