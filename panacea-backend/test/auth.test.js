import request from 'supertest';
import app from '../src/app.js'; // Import app (logic) without server (listener)
import { connect, close } from './setup.js';

// Lifecycle Hooks
beforeAll(async () => {
    await connect();
});

afterAll(async () => {
    await close();
});

describe('System & Auth Endpoints', () => {

    // TEST 1: Is the System Alive?
    it('GET /api/health should return 200 OK', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Panacea System Operational'); // Using standard response
    });

    // TEST 2: Registration Logic
    it('POST /api/auth/register should create a new user', async () => {
        const res = await request(app).post('/api/auth/register').send({
            name: "Test Doctor",
            email: "test.doc@hospital.com",
            password: "password123", // Long enough (>6)
            role: "doctor"
        });

        // Expect 201 Created
        expect(res.statusCode).toEqual(201);
        // Verify Data Structure (Standard Response: success, data.token)
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('token');
        expect(res.body.data.user.email).toEqual("test.doc@hospital.com");
    });

    // TEST 3: Validation Logic
    it('POST /api/auth/register should fail with short password', async () => {
        const res = await request(app).post('/api/auth/register').send({
            name: "Bad Pass User",
            email: "badpass@hospital.com",
            password: "123", // Too short
            role: "patient"
        });

        // Expect 422 Unprocessable Entity (from validatorMiddleware)
        expect(res.statusCode).toEqual(422);
    });
});