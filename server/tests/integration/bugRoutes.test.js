import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../src/app.js';
import Bug from '../../src/models/Bug.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Bug.deleteMany();
});

describe('Bug Routes Integration Tests', () => {
  describe('GET /api/bugs', () => {
    it('should return empty array when no bugs exist', async () => {
      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    it('should return all bugs', async () => {
      // Create test bugs
      const bug1 = await Bug.create({
        title: 'Bug 1',
        description: 'Description 1',
        reporter: 'John Doe'
      });

      const bug2 = await Bug.create({
        title: 'Bug 2',
        description: 'Description 2',
        reporter: 'Jane Smith'
      });

      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].title).toBe(bug2.title); // Should be sorted by latest
    });

    it('should filter bugs by status', async () => {
      await Bug.create([
        {
          title: 'Open Bug',
          description: 'Description',
          reporter: 'John Doe',
          status: 'open'
        },
        {
          title: 'Resolved Bug',
          description: 'Description',
          reporter: 'Jane Smith',
          status: 'resolved'
        }
      ]);

      const response = await request(app)
        .get('/api/bugs?status=open')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].status).toBe('open');
    });
  });

  describe('POST /api/bugs', () => {
    it('should create a new bug', async () => {
      const newBug = {
        title: 'New Test Bug',
        description: 'This is a test bug description',
        reporter: 'Test User',
        priority: 'high'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(newBug)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('created');
      expect(response.body.data.title).toBe(newBug.title);
      expect(response.body.data.status).toBe('open'); // Default value
    });

    it('should return 400 for invalid bug data', async () => {
      const invalidBug = {
        title: '', // Empty title
        description: 'Test description',
        reporter: 'Test User'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(invalidBug)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.title).toBeDefined();
    });
  });

  describe('PUT /api/bugs/:id', () => {
    it('should update an existing bug', async () => {
      const bug = await Bug.create({
        title: 'Original Title',
        description: 'Original Description',
        reporter: 'Original Reporter'
      });

      const updates = {
        title: 'Updated Title',
        status: 'in-progress'
      };

      const response = await request(app)
        .put(`/api/bugs/${bug._id}`)
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updates.title);
      expect(response.body.data.status).toBe(updates.status);
    });

    it('should return 404 for non-existent bug', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .put(`/api/bugs/${fakeId}`)
        .send({ title: 'Update' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('DELETE /api/bugs/:id', () => {
    it('should delete an existing bug', async () => {
      const bug = await Bug.create({
        title: 'Bug to delete',
        description: 'Description',
        reporter: 'Test User'
      });

      const response = await request(app)
        .delete(`/api/bugs/${bug._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted');

      // Verify bug is actually deleted
      const deletedBug = await Bug.findById(bug._id);
      expect(deletedBug).toBeNull();
    });

    it('should return 404 for non-existent bug on delete', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .delete(`/api/bugs/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});