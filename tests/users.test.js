const request = require('supertest');
const app = require('../../src/app');
const { connect, closeDatabase, clearDatabase } = require('../helpers/db.helper');

let adminToken;
let userToken;
let userId;

beforeAll(async () => {
  await connect();

  // Create an admin user (manually set role after register)
  const User = require('../../src/models/User');
  const adminRes = await request(app).post('/api/auth/register').send({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Admin1234',
  });
  adminToken = adminRes.body.data.accessToken;
  await User.findByIdAndUpdate(adminRes.body.data.user._id, { role: 'admin' });

  // Create a regular user
  const userRes = await request(app).post('/api/auth/register').send({
    name: 'Regular User',
    email: 'user@example.com',
    password: 'User12345',
  });
  userToken = userRes.body.data.accessToken;
  userId = userRes.body.data.user._id;
});

afterAll(async () => {
  await closeDatabase();
});

describe('GET /api/users', () => {
  it('should return all users for admin', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('pagination');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should return 403 for non-admin users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(401);
  });
});

describe('GET /api/users/:id', () => {
  it('should return a user by ID for admin', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.user._id).toBe(userId);
  });

  it('should return 404 for non-existent user', async () => {
    const res = await request(app)
      .get('/api/users/000000000000000000000000')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });
});

describe('PUT /api/users/me', () => {
  it('should update the current user profile', async () => {
    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Updated Name' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.name).toBe('Updated Name');
  });

  it('should return 422 for invalid data', async () => {
    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ email: 'not-an-email' });
    expect(res.statusCode).toBe(422);
  });
});
