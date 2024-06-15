import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../../models/user.model.js';
import { signIn } from '../../controllers/auth.controller.js'; 
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('signIn controller tests', () => {
  let mongoServer;
  let connection;
  let db;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    connection = await mongoose.connect(uri, {});
    db = connection.connection.db;
  });

  afterEach(async () => {
    await db.dropDatabase();
  });

  afterAll(async () => {
    await connection.disconnect();
    await mongoServer.stop();
  });

  // Successful Login Test
  it('should successfully login a valid user', async () => {
    const testUser = {
      username: 'test_user',
      email: 'test@example.com',
      password: 'test_password',
    };

    const hashedPassword = bcryptjs.hashSync(testUser.password, 10);
    const newUser = new User({ ...testUser, password: hashedPassword });
    await newUser.save();
    console.log(newUser)

    const req = {
      body: {
        username: testUser.username,
        password: testUser.password,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };
    const next = jest.fn();
    await signIn(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: expect.any(String) }));
  });

  // Invalid Username Test
  it('should return error for invalid username', async () => {
    const testUser = {
      username: 'test_user',
      email: 'test@example.com',
      password: 'test_password',
    };

    const hashedPassword = bcryptjs.hashSync(testUser.password, 10);
    const newUser = new User({ ...testUser, password: hashedPassword });
    await newUser.save();

    const req = {
      body: {
        username: 'invalid_username',
        password: testUser.password,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await signIn(req, res, next);

    expect(res.status).not.toHaveBeenCalledWith(200);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  // Invalid Password Test
  it('should return error for invalid password', async () => {
    const testUser = {
      username: 'test_user',
      email: 'test@example.com',
      password: 'test_password',
    };

    const hashedPassword = bcryptjs.hashSync(testUser.password, 10);
    const newUser = new User({ ...testUser, password: hashedPassword });
    await newUser.save();

    const req = {
      body: {
        username: testUser.username,
        password: 'invalid_password',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await signIn(req, res, next);

    expect(res.status).not.toHaveBeenCalledWith(200);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should handle errors during login', async () => {
    // Simulate an error (e.g., database connection issue)
    const mockError = new Error('Database connection error');
    const next = jest.fn().mockImplementationOnce(() => { throw mockError; });

    const req = {
      body: {
        username: 'test_user',
        password: 'test_password',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await signIn(req, res, next);

    expect(res.status).not.toHaveBeenCalledWith(200);
    expect(next).toHaveBeenCalledWith(mockError); // Verify the specific error is passed to next
  });
});
