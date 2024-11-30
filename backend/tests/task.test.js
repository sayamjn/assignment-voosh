const request = require('supertest');
const app = require('../index');
const { setupTestDB, createTestUser, createTestTask } = require('./testUtils');

setupTestDB();

describe('Task API', () => {
  let token;
  let user;

  beforeEach(async () => {
    const testData = await createTestUser();
    user = testData.user;
    token = testData.token;
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        dueDate: new Date('2024-12-31'),
        priority: 'high',
        labels: ['important']
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(taskData.title);
      expect(response.body.priority).toBe(taskData.priority);
      expect(response.body.userId).toBe(user._id.toString());
    });

    it('should validate required fields', async () => {
        const response = await request(app)
          .post('/api/tasks')
          .set('Authorization', `Bearer ${token}`)
          .send({});
      
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          error: 'Validation Error',
          details: expect.arrayContaining([
            expect.stringContaining('title'),
            expect.stringContaining('description')
          ])
        });
      });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      await createTestTask(user._id, {
        title: 'Task 1',
        status: 'todo',
        dueDate: new Date('2024-12-31')
      });
      await createTestTask(user._id, {
        title: 'Task 2',
        status: 'inProgress'
      });
    });

    it('should get all tasks for user', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('userId', user._id.toString());
    });

    it('should get overdue tasks', async () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);
      
        await createTestTask(user._id, {
          title: 'Overdue Task',
          description: 'Test Description',
          status: 'todo',
          dueDate: pastDate
        });
      
        const response = await request(app)
          .get('/api/tasks/overdue')
          .set('Authorization', `Bearer ${token}`);
      
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0]).toMatchObject({
          title: 'Overdue Task',
          status: 'todo',
          isOverdue: true,
          dueDate: expect.any(String)
        });
      });
      
      
  });

  describe('PATCH /api/tasks/:id', () => {
    let task;

    beforeEach(async () => {
      task = await createTestTask(user._id);
    });

    it('should update task details', async () => {
      const updates = {
        title: 'Updated Title',
        priority: 'high'
      };

      const response = await request(app)
        .patch(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updates.title);
      expect(response.body.priority).toBe(updates.priority);
    });

    it('should update task status', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${task._id}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'inProgress' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('inProgress');
    });
  });
});