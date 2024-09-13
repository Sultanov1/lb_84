import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import Task from './models/Task';
import crypto from 'crypto';

const run = async () => {
  await mongoose.connect(config.database);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
    await db.dropCollection('tasks');
  } catch (error) {
    console.log('Skipping drop...')
  }

  const user = await User.create({
    username: 'user',
    password: '54321',
    token: crypto.randomUUID(),
  });

  await Task.create({
    user: user,
    title: 'Solve a new task',
    description: 'A new big project on my way',
    status: 'new',
  });

  await db.close();
};

void run();

run().catch(console.error);