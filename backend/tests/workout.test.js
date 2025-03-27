/**
 * @file tests/workout.test.js
 * @description End-to-end tests for Workout-related REST endpoints.
 * These tests cover success cases and error handling for each endpoint.
 * The endpoints being tested include:
 *   - POST   /api/v1/workouts        (Create a new workout)
 *   - GET    /api/v1/workouts        (Retrieve all workouts for the authenticated user)
 *   - GET    /api/v1/workouts/:id    (Retrieve a specific workout by ID)
 *   - PATCH  /api/v1/workouts/:id    (Partially update a workout by ID)
 *   - DELETE /api/v1/workouts/:id    (Delete a workout by ID)
 *
 * Each test simulates various scenarios, including valid requests,
 * missing or invalid parameters, and simulated internal errors.
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Workout = require('../models/workout');

// Mock the JWT verification to always return a dummy user id.
jest.mock('../utils/jwtUtils', () => ({
    verifyToken: (token) => {
        // For testing purposes, any token is considered valid
        // and returns this dummy user id.
        return { id: "605c0e1f6f0b5c001a17e7e1" };
    },
}));

describe('Workout API Endpoints', () => {
    // Clean up workouts collection before each test.
    beforeEach(async () => {
        await Workout.deleteMany({});
    });

    // Close Mongoose connection after all tests.
    afterAll(async () => {
        await mongoose.connection.close();
    });

    /**
     * Tests for the POST /api/v1/workouts endpoint.
     *
     * These tests ensure that creating a new workout works as expected:
     *   - With valid data, a workout is created (201).
     *   - With missing required fields, a 400 error is returned.
     *   - If a server error occurs, a 500 error is returned.
     */
    describe('POST /api/v1/workouts', () => {
        it('should create a new workout when provided valid data', async () => {
            const newWorkout = {
                title: 'Test Workout',
                description: 'Workout description',
                dateTime: '2025-03-01T12:00:00Z',
                exercises: [
                    {
                        exerciseId: new mongoose.Types.ObjectId(),
                        sets: 3,
                        reps: 10
                    }
                ]
            };

            const res = await request(app)
                .post('/api/v1/workouts')
                .set('Authorization', 'Bearer validtoken')
                .send(newWorkout)
                .expect(201);

            expect(res.body).toHaveProperty('message', 'Workout created successfully.');
            expect(res.body).toHaveProperty('workout');
            expect(res.body.workout).toHaveProperty('_id');
            expect(res.body.workout.title).toBe(newWorkout.title);
        });

        it('should return 400 if required fields are missing', async () => {
            const invalidWorkout = {
                description: 'Workout description',
                // Missing title, dateTime and an empty exercises array.
                exercises: []
            };

            const res = await request(app)
                .post('/api/v1/workouts')
                .set('Authorization', 'Bearer validtoken')
                .send(invalidWorkout)
                .expect(400);

            expect(res.body).toHaveProperty('error', 'Title, dateTime, and at least one exercise are required.');
        });

        it('should return 500 if an internal error occurs', async () => {
            // Force an error by mocking the save method.
            const originalSave = Workout.prototype.save;
            Workout.prototype.save = jest.fn().mockImplementation(() => {
                throw new Error('Simulated failure');
            });

            const newWorkout = {
                title: 'Test Workout',
                description: 'Workout description',
                dateTime: '2025-03-01T12:00:00Z',
                exercises: [
                    {
                        exerciseId: new mongoose.Types.ObjectId(),
                        sets: 3,
                        reps: 10
                    }
                ]
            };

            const res = await request(app)
                .post('/api/v1/workouts')
                .set('Authorization', 'Bearer validtoken')
                .send(newWorkout)
                .expect(500);

            expect(res.body).toHaveProperty('error', 'Internal server error.');

            // Restore the original save method.
            Workout.prototype.save = originalSave;
        });
    });

    /**
     * Tests for the GET /api/v1/workouts endpoint.
     *
     * These tests verify that retrieving all workouts for the authenticated user works as expected:
     *   - When workouts exist, the endpoint returns an array of workouts (200).
     *   - If a server error occurs, a 500 error is returned.
     */
    describe('GET /api/v1/workouts', () => {
        it('should retrieve all workouts for the authenticated user', async () => {
            // Insert sample workouts with the dummy user id.
            await Workout.create([
                {
                    userId: "605c0e1f6f0b5c001a17e7e1",
                    title: 'Workout 1',
                    description: 'Description 1',
                    dateTime: new Date('2025-03-01T12:00:00Z'),
                    exercises: [{ exerciseId: new mongoose.Types.ObjectId(), sets: 3, reps: 10 }]
                },
                {
                    userId: "605c0e1f6f0b5c001a17e7e1",
                    title: 'Workout 2',
                    description: 'Description 2',
                    dateTime: new Date('2025-03-02T12:00:00Z'),
                    exercises: [{ exerciseId: new mongoose.Types.ObjectId(), sets: 4, reps: 8 }]
                }
            ]);

            const res = await request(app)
                .get('/api/v1/workouts')
                .set('Authorization', 'Bearer validtoken')
                .expect(200);

            expect(Array.isArray(res.body.workouts)).toBe(true);
            expect(res.body.workouts.length).toBe(2);
        });

        it('should return 500 if an internal error occurs', async () => {
            const originalFind = Workout.find;
            Workout.find = jest.fn().mockImplementation(() => {
                throw new Error('Simulated failure');
            });

            const res = await request(app)
                .get('/api/v1/workouts')
                .set('Authorization', 'Bearer validtoken')
                .expect(500);

            expect(res.body).toHaveProperty('error', 'Internal server error.');
            Workout.find = originalFind;
        });
    });

    /**
     * Tests for the GET /api/v1/workouts/:id endpoint.
     *
     * These tests ensure that retrieving a specific workout by its ID works as expected:
     *   - With a valid ID, the workout is returned (200).
     *   - With an invalid ID format, a 400 error is returned.
     *   - With a valid but non-existent ID, a 404 error is returned.
     *   - If a server error occurs, a 500 error is returned.
     */
    describe('GET /api/v1/workouts/:id', () => {
        it('should retrieve a workout by its ID', async () => {
            const workout = await Workout.create({
                userId: "605c0e1f6f0b5c001a17e7e1",
                title: 'Test Workout',
                description: 'Description',
                dateTime: new Date('2025-03-01T12:00:00Z'),
                exercises: [{ exerciseId: new mongoose.Types.ObjectId(), sets: 3, reps: 10 }]
            });

            const res = await request(app)
                .get(`/api/v1/workouts/${workout._id}`)
                .set('Authorization', 'Bearer validtoken')
                .expect(200);

            expect(res.body).toHaveProperty('message', 'Workout retrieved successfully.');
            expect(res.body.workout).toHaveProperty('_id', workout._id.toString());
        });

        it('should return 400 for an invalid workout ID format', async () => {
            const res = await request(app)
                .get('/api/v1/workouts/invalid-id')
                .set('Authorization', 'Bearer validtoken')
                .expect(400);

            expect(res.body).toHaveProperty('error', 'Invalid workout ID.');
        });

        it('should return 404 if the workout is not found', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .get(`/api/v1/workouts/${nonExistentId}`)
                .set('Authorization', 'Bearer validtoken')
                .expect(404);

            expect(res.body).toHaveProperty('error', 'Workout not found.');
        });

        it('should return 500 if an internal error occurs', async () => {
            const originalFindOne = Workout.findOne;
            Workout.findOne = jest.fn().mockImplementation(() => {
                throw new Error('Simulated failure');
            });

            const validId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .get(`/api/v1/workouts/${validId}`)
                .set('Authorization', 'Bearer validtoken')
                .expect(500);

            expect(res.body).toHaveProperty('error', 'Internal server error.');
            Workout.findOne = originalFindOne;
        });
    });

    /**
     * Tests for the PATCH /api/v1/workouts/:id endpoint.
     *
     * These tests verify that partially updating a workout works as expected:
     *   - With valid data, the workout is updated (200).
     *   - With an invalid ID format, a 400 error is returned.
     *   - With a valid but non-existent ID, a 404 error is returned.
     *   - If a server error occurs during update, a 500 error is returned.
     */
    describe('PATCH /api/v1/workouts/:id', () => {
        it('should update a workout partially', async () => {
            const workout = await Workout.create({
                userId: "605c0e1f6f0b5c001a17e7e1",
                title: 'Initial Workout',
                description: 'Initial Description',
                dateTime: new Date('2025-03-01T12:00:00Z'),
                exercises: [{ exerciseId: new mongoose.Types.ObjectId(), sets: 3, reps: 10 }]
            });

            const updates = {
                title: 'Updated Workout',
                exercises: [
                    {
                        exerciseId: workout.exercises[0].exerciseId.toString(),
                        sets: 5
                    }
                ]
            };

            const res = await request(app)
                .patch(`/api/v1/workouts/${workout._id}`)
                .set('Authorization', 'Bearer validtoken')
                .send(updates)
                .expect(200);

            expect(res.body).toHaveProperty('message', 'Workout updated successfully.');
            expect(res.body.workout.title).toBe('Updated Workout');
            expect(res.body.workout.exercises[0].sets).toBe(5);
        });

        it('should return 400 for an invalid workout ID format', async () => {
            const res = await request(app)
                .patch('/api/v1/workouts/invalid-id')
                .set('Authorization', 'Bearer validtoken')
                .send({ title: 'New Title' })
                .expect(400);

            expect(res.body).toHaveProperty('error', 'Invalid workout ID.');
        });

        it('should return 404 if the workout is not found', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .patch(`/api/v1/workouts/${nonExistentId}`)
                .set('Authorization', 'Bearer validtoken')
                .send({ title: 'New Title' })
                .expect(404);

            expect(res.body).toHaveProperty('error', 'Workout not found.');
        });

        it('should return 500 if an internal error occurs', async () => {
            // Create a workout normally.
            const workout = await Workout.create({
                userId: "605c0e1f6f0b5c001a17e7e1",
                title: 'Initial Workout',
                description: 'Initial Description',
                dateTime: new Date('2025-03-01T12:00:00Z'),
                exercises: [{ exerciseId: new mongoose.Types.ObjectId(), sets: 3, reps: 10 }]
            });

            // Override the prototype's save method to simulate a failure.
            const originalSave = Workout.prototype.save;
            Workout.prototype.save = jest.fn().mockImplementation(() => {
                throw new Error('Simulated failure');
            });

            const res = await request(app)
                .patch(`/api/v1/workouts/${workout._id}`)
                .set('Authorization', 'Bearer validtoken')
                .send({ title: 'New Title' })
                .expect(500);

            expect(res.body).toHaveProperty('error', 'Internal server error.');

            // Restore the original save method.
            Workout.prototype.save = originalSave;
        });
    });

    /**
     * Tests for the DELETE /api/v1/workouts/:id endpoint.
     *
     * These tests ensure that deleting a workout works as expected:
     *   - With a valid ID, the workout is deleted (200) and removed from the database.
     *   - With an invalid ID format, a 400 error is returned.
     *   - With a valid but non-existent ID, a 404 error is returned.
     *   - If a server error occurs during deletion, a 500 error is returned.
     */
    describe('DELETE /api/v1/workouts/:id', () => {
        it('should delete an existing workout', async () => {
            const workout = await Workout.create({
                userId: "605c0e1f6f0b5c001a17e7e1",
                title: 'Workout to Delete',
                description: 'Description',
                dateTime: new Date('2025-03-01T12:00:00Z'),
                exercises: [{ exerciseId: new mongoose.Types.ObjectId(), sets: 3, reps: 10 }]
            });

            const res = await request(app)
                .delete(`/api/v1/workouts/${workout._id}`)
                .set('Authorization', 'Bearer validtoken')
                .expect(200);

            expect(res.body).toHaveProperty('message', 'Workout deleted successfully.');

            const deletedWorkout = await Workout.findById(workout._id);
            expect(deletedWorkout).toBeNull();
        });

        it('should return 400 for an invalid workout ID format', async () => {
            const res = await request(app)
                .delete('/api/v1/workouts/invalid-id')
                .set('Authorization', 'Bearer validtoken')
                .expect(400);

            expect(res.body).toHaveProperty('error', 'Invalid workout ID.');
        });

        it('should return 404 if the workout is not found', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .delete(`/api/v1/workouts/${nonExistentId}`)
                .set('Authorization', 'Bearer validtoken')
                .expect(404);

            expect(res.body).toHaveProperty('error', 'Workout not found.');
        });

        it('should return 500 if an internal error occurs', async () => {
            const workout = await Workout.create({
                userId: "605c0e1f6f0b5c001a17e7e1",
                title: 'Workout to Delete',
                description: 'Description',
                dateTime: new Date('2025-03-01T12:00:00Z'),
                exercises: [{ exerciseId: new mongoose.Types.ObjectId(), sets: 3, reps: 10 }]
            });

            // Force an error by mocking the deleteOne method.
            const originalDeleteOne = Workout.deleteOne;
            Workout.deleteOne = jest.fn().mockImplementation(() => {
                throw new Error('Simulated failure');
            });

            const res = await request(app)
                .delete(`/api/v1/workouts/${workout._id}`)
                .set('Authorization', 'Bearer validtoken')
                .expect(500);

            expect(res.body).toHaveProperty('error', 'Internal server error.');
            Workout.deleteOne = originalDeleteOne;
        });
    });
});
