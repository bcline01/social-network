import db from '../config/connection.js';
import { User, Thought } from '../models/index.js';
import cleanDB from './cleanDB.js';
import { getRandomName, getRandomThought, getRandomReaction } from './data.js';

try {
  // Connect to the database and clean up previous entries
  await db();
  await cleanDB();

  // Create empty arrays to hold users and thoughts
  const users = [];
  const thoughts = [];

  // Loop 20 times -- generate users and thoughts
  for (let i = 0; i < 20; i++) {
    // Generate random name
    const fullName = getRandomName();
    const first = fullName.split(' ')[0];
    const last = fullName.split(' ')[1];

    // Generate random username and email
    const username = `${first.toLowerCase()}${Math.floor(Math.random() * (99 - 18 + 1) + 18)}`;
    const email = `${first.toLowerCase()}.${last.toLowerCase()}@example.com`;

    // Create a random thought for each user
    const thoughtText = getRandomThought();
    const thought = new Thought({ thoughtText, username, reactions: [getRandomReaction()] });

    // Push thought to thoughts array
    thoughts.push(thought);

    // Push the generated user data into the users array, referencing the created thought
    users.push({
      username,
      email,
      thoughts: [thought._id], 
      friends: [], 
    });
  }

  // Insert thoughts into the Thought collection
  await Thought.insertMany(thoughts);

  // Insert users into the User collection
  const userData = await User.create(users);

  // Log out the seed data to indicate what should appear in the database
  console.table(userData);
  console.table(thoughts);
  console.info('Seeding complete! 🌱');
  process.exit(0);
} catch (error) {
  console.error('Error seeding database:', error);
  process.exit(1);
}
