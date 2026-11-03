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
        {
          id: 1,
          name: 'Alice',
          age: 25,
          active: true,
          posts: [
            { id: 1, title: 'Alice Post 1', published: true },
            { id: 2, title: 'Alice Post 2', published: false }
          ]
        },
        {
          id: 2,
          name: 'Bob',
          age: 30,
          active: false,
          posts: [
            { id: 3, title: 'Bob Post 1', published: true }
          ]
        },
        {
          id: 3,
          name: 'Charlie',
          age: 25,
          active: true,
          posts: []
        }
      ],
      posts: [
        { id: 101, title: 'Hello World', published: true },
        { id: 102, title: 'Draft Post', published: false }
      ]
    };
    fs.writeFileSync(testJsonPath, JSON.stringify(testData, null, 2));
  });

  beforeEach(() => {
    // Reset test data before each test
    const testData = {
      users: [
        {
          id: 1,
          name: 'Alice',
          age: 25,
          active: true,
          posts: [
            { id: 1, title: 'Alice Post 1', published: true },
            { id: 2, title: 'Alice Post 2', published: false }
          ]
        },
        {
          id: 2,
          name: 'Bob',
          age: 30,
          active: false,
          posts: [
            { id: 3, title: 'Bob Post 1', published: true }
          ]
        },
        {
          id: 3,
          name: 'Charlie',
          age: 25,
          active: true,
          posts: []
        }
      ],
      posts: [
        { id: 101, title: 'Hello World', published: true },
        { id: 102, title: 'Draft Post', published: false }
      ]
    };
    fs.writeFileSync(testJsonPath, JSON.stringify(testData, null, 2));

    // Start server for each test (port 0 for testing)
    const result = startServer(testJsonPath, 0, 0);
    app = result.app;
    server = result.server;
  });

  afterAll(() => {
    // Clean up the test file
    if (fs.existsSync(testJsonPath)) {
      fs.unlinkSync(testJsonPath);
    }
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
      expect(response.body.length).toBe(3);
      expect(response.body[0].name).toBe('Alice');
      expect(response.body[0].posts).toBeDefined();
    });
  });

  describe('GET /users/:id', () => {
    it('should return a specific user by ID', async () => {
      const response = await request(app).get('/users/1');
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.name).toBe('Alice');
      expect(response.body.age).toBe(25);
      expect(response.body.posts).toBeDefined();
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
      expect(response.body.id).toBe(4);
      expect(response.body.name).toBe('Charlie');
    });

    it('should create an item even with empty body', async () => {
      const response = await request(app)
        .post('/users')
        .send({});

      expect(response.status).toBe(201);
      expect(response.body.id).toBe(4);
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

  describe('Query parameter filtering', () => {
    it('should filter by string field (case-insensitive)', async () => {
      const response = await request(app).get('/users?name=Alice');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body.every(user => user.name === 'Alice')).toBe(true);
    });

    it('should filter by number field', async () => {
      const response = await request(app).get('/users?age=25');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body.every(user => user.age === 25)).toBe(true);
    });

    it('should filter by boolean field', async () => {
      const response = await request(app).get('/users?active=true');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body.every(user => user.active === true)).toBe(true);
    });

    it('should filter by multiple parameters', async () => {
      const response = await request(app).get('/users?name=Alice&age=25');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body.every(user => user.name === 'Alice' && user.age === 25)).toBe(true);
    });

    it('should return empty array when no matches', async () => {
      const response = await request(app).get('/users?name=NonExistent');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should return all items when no query parameters', async () => {
      const response = await request(app).get('/users');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(3);
    });

    it('should handle boolean false value', async () => {
      const response = await request(app).get('/users?active=false');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].active).toBe(false);
    });

    it('should filter posts by published status', async () => {
      const response = await request(app).get('/posts?published=true');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].published).toBe(true);
    });
  });

  describe('Nested routes', () => {
    describe('GET /users/:id/posts', () => {
      it('should return nested posts for a user', async () => {
        const response = await request(app).get('/users/1/posts');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
        expect(response.body[0].title).toBe('Alice Post 1');
      });

      it('should return empty array for user with no posts', async () => {
        const response = await request(app).get('/users/3/posts');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
      });

      it('should return 404 for non-existent user', async () => {
        const response = await request(app).get('/users/999/posts');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Parent item not found');
      });

      it('should filter nested posts by query parameters', async () => {
        const response = await request(app).get('/users/1/posts?published=true');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].published).toBe(true);
      });
    });

    describe('GET /users/:id/posts/:postId', () => {
      it('should return a specific nested post', async () => {
        const response = await request(app).get('/users/1/posts/1');
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(1);
        expect(response.body.title).toBe('Alice Post 1');
      });

      it('should return 404 for non-existent nested post', async () => {
        const response = await request(app).get('/users/1/posts/999');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Nested item not found');
      });

      it('should return 404 for non-existent parent', async () => {
        const response = await request(app).get('/users/999/posts/1');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Parent item not found');
      });
    });

    describe('POST /users/:id/posts', () => {
      it('should create a new nested post', async () => {
        const newPost = { title: 'New Post', published: true };
        const response = await request(app)
          .post('/users/1/posts')
          .send(newPost);

        expect(response.status).toBe(201);
        expect(response.body.id).toBe(3);
        expect(response.body.title).toBe('New Post');
      });

      it('should return 404 for non-existent user', async () => {
        const response = await request(app)
          .post('/users/999/posts')
          .send({ title: 'Test' });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Parent item not found');
      });
    });

    describe('PUT /users/:id/posts/:postId', () => {
      it('should update a nested post', async () => {
        const updatedData = { title: 'Updated Post' };
        const response = await request(app)
          .put('/users/1/posts/1')
          .send(updatedData);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(1);
        expect(response.body.title).toBe('Updated Post');
      });

      it('should return 404 for non-existent nested post', async () => {
        const response = await request(app)
          .put('/users/1/posts/999')
          .send({ title: 'Test' });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Nested item not found');
      });
    });

    describe('DELETE /users/:id/posts/:postId', () => {
      it('should delete a nested post', async () => {
        const response = await request(app).delete('/users/1/posts/1');

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(1);
        expect(response.body.title).toBe('Alice Post 1');
      });

      it('should return 404 for non-existent nested post', async () => {
        const response = await request(app).delete('/users/1/posts/999');

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Nested item not found');
      });
    });
  });

  describe('Delay functionality', () => {
    let delayedApp;
    let delayedServer;

    beforeEach(() => {
      const result = startServer(testJsonPath, 0, 100);
      delayedApp = result.app;
      delayedServer = result.server;
    });

    afterEach(() => {
      if (delayedServer) {
        delayedServer.close();
      }
    });

    it('should add delay to responses', async () => {
      const startTime = Date.now();
      await request(delayedApp).get('/users');
      const endTime = Date.now();
      const elapsedTime = endTime - startTime;

      expect(elapsedTime).toBeGreaterThanOrEqual(100);
    });

    it('should add delay to POST requests', async () => {
      const startTime = Date.now();
      await request(delayedApp)
        .post('/users')
        .send({ name: 'Delayed User' });
      const endTime = Date.now();
      const elapsedTime = endTime - startTime;

      expect(elapsedTime).toBeGreaterThanOrEqual(100);
    });

    it('should add delay to PUT requests', async () => {
      const startTime = Date.now();
      await request(delayedApp)
        .put('/users/1')
        .send({ name: 'Delayed Update' });
      const endTime = Date.now();
      const elapsedTime = endTime - startTime;

      expect(elapsedTime).toBeGreaterThanOrEqual(100);
    });

    it('should add delay to DELETE requests', async () => {
      const startTime = Date.now();
      await request(delayedApp).delete('/users/2');
      const endTime = Date.now();
      const elapsedTime = endTime - startTime;

      expect(elapsedTime).toBeGreaterThanOrEqual(100);
    });

    it('should not add delay when delay is 0', async () => {
      const result = startServer(testJsonPath, 0, 0);
      const noDelayApp = result.app;
      const noDelayServer = result.server;

      const startTime = Date.now();
      await request(noDelayApp).get('/users');
      const endTime = Date.now();
      const elapsedTime = endTime - startTime;

      expect(elapsedTime).toBeLessThan(50);

      if (noDelayServer) {
        noDelayServer.close();
      }
    });

    it('should apply delay even with query parameters', async () => {
      const startTime = Date.now();
      await request(delayedApp).get('/users?name=Alice');
      const endTime = Date.now();
      const elapsedTime = endTime - startTime;

      expect(elapsedTime).toBeGreaterThanOrEqual(100);
    });
  });
});
