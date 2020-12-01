const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { default: xss } = require('xss');

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      users
      RESTART IDENTITY CASCADE`
  );
}

function makeUsersArray() {
  return [
    {
      id: 1,
      email: 'test-user-1@gmail.com',
      password: 'password',
      playerName: 'First1',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      email: 'test-user-2@gmail.com',
      password: 'password',
      playerName: 'First2',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      email: 'test-user-3@gmail.com',
      password: 'password',
      playerName: 'First3',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      email: 'test-user-4@gmail.com',
      password: 'password',
      playerName: 'First4',
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ];
}

function makeAppFixtures() {
  const testUsers = makeUsersArray();
  return { testUsers };
}

function seedUsers(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db
    .into('users')
    .insert(preppedUsers)
    .then(() =>
      db.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id])
    );
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign(
    {
      user_id: user.id
    },
    secret,
    {
      subject: user.email,
      expiresIn: process.env.JWT_EXPIRY,
      algorithm: 'HS256',
    }
  );
  return `Bearer ${token}`;
}

module.exports = {
  cleanTables,
  makeUsersArray,
  makeAppFixtures,
  seedUsers,
  makeAuthHeader,
};
