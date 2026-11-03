const request = require('supertest');
const { startServer } = require('../lib/server');
const fs = require('fs');
const path = require('path');

describe('mock-drop Server', () => {
  let app;
  let server;
  let testJsonPath;

  beforeAll(() => {
    // Create a temporary test JSON file
    testJsonPath = path.join(__dirname, 'test-data.json');
    const testData = {
      users: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ],
      posts: [
        { id: 101, title: 'Hello World' }
      ]
    };
    fs.writeFileSync(testJsonPath, JSON.stringify(testData, null, 2));
  });

  afterAll(() => {
    // Clean up the test file
    if (fs.existsSync(testJsonPath)) {
      fs.unlinkSync(testJsonPath);
    }
  });

  beforeEach(() => {
    // Start server for each test (port 0 for testing)
    const result = startServer(testJsonPath, 0);
    app = result.app;
    server = result.server;
  });

  afterEach(() => {
    // Close server after each test (if running)
    if (server) {
      server.close();
    }
  });

  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('mock-drop API');
      expect(response.body.endpoints).toBeDefined();
      expect(Array.isArray(response.body.endpoints)).toBe(true);
    });
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      const response = await request(app).get('/users');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].name).toBe('Alice');
    });
  });

  describe('GET /users/:id', () => {
    it('should return a specific user by ID', async () => {
      const response = await request(app).get('/users/1');
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.name).toBe('Alice');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app).get('/users/999');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Item not found');
    });
  });

  describe('POST /users', () => {
    it('should create a new user with auto-incremented ID', async () => {
      const newUser = { name: 'Charlie' };
      const response = await request(app)
        .post('/users')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.id).toBe(3);
      expect(response.body.name).toBe('Charlie');
    });

    it('should create an item even with empty body', async () => {
      const response = await request(app)
        .post('/users')
        .send({});

      expect(response.status).toBe(201);
      expect(response.body.id).toBe(3);
    });
  });

  describe('PUT /users/:id', () => {
    it('should update an existing user', async () => {
      const updatedData = { name: 'Alice Updated' };
      const response = await request(app)
        .put('/users/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.name).toBe('Alice Updated');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .put('/users/999')
        .send({ name: 'Test' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Item not found');
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete an existing user', async () => {
      const response = await request(app).delete('/users/1');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.name).toBe('Alice');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app).delete('/users/999');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Item not found');
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for non-existent endpoint', async () => {
      const response = await request(app).get('/nonexistent');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Endpoint not found');
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/users')
        .set('Origin', 'http://localhost:3001');

      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});
