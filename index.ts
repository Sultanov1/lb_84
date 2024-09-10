import express from 'express';
import mongoose from 'mongoose';
import config from './config';
import userRouter from './routes/users';
import taskRouter from './routes/tasks';
import cors from 'cors';

const app = express();
const port = 8000;

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

app.use('/users', userRouter)
app.use('/tasks', taskRouter);

const run = async () => {
  await mongoose.connect(config.database)

  app.listen(port, () => {
    console.log('Listening on port', port);
  })

  process.on('exit', () => {
    mongoose.disconnect();
  })
}

run().catch(console.error);