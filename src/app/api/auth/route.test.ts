// app/api/auth/route.test.ts
import { NextResponse } from 'next/server';
import { POST, DELETE } from './route';  // Import the POST and DELETE methods
import { getUserByEmail } from '../../../db/select';
import { comparePasswords } from '../../lib/encryptio';
import { createSession, deleteSession } from '../../lib/session';

// Mock the necessary dependencies
jest.mock('../../../db/select');
jest.mock('../../lib/encryptio');
jest.mock('../../lib/session');

describe('Auth API Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();  // Clear any previous mock calls before each test
    });

    describe('POST /api/auth', () => {
        it('should return error if user does not exist', async () => {
            // Mock the behavior of getUserByEmail
            (getUserByEmail as jest.Mock).mockResolvedValue(null);

            const req = {
                json: jest.fn().mockResolvedValue({ email: 'test@example.com', password: 'password123' }),
            } as unknown as Request;

            const response = await POST(req);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.message).toBe('Error: email or password incorrect');
        });

        it('should return error if email is not verified', async () => {
            // Mock user that exists but is not verified
            (getUserByEmail as jest.Mock).mockResolvedValue({
                email: 'test@example.com',
                password: 'hashedPassword',
                isVerified: false,
            });

            const req = {
                json: jest.fn().mockResolvedValue({ email: 'test@example.com', password: 'password123' }),
            } as unknown as Request;

            const response = await POST(req);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.message).toBe('Error: Verify email');
        });

        it('should return error if password does not match', async () => {
            // Mock user data and comparePasswords function
            (getUserByEmail as jest.Mock).mockResolvedValue({
                email: 'test@example.com',
                password: 'hashedPassword',
                isVerified: true,
            });
            (comparePasswords as jest.Mock).mockResolvedValue(false);

            const req = {
                json: jest.fn().mockResolvedValue({ email: 'test@example.com', password: 'wrongPassword' }),
            } as unknown as Request;

            const response = await POST(req);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.message).toBe('Error: email or password incorrect');
        });

        it('should return success if login is successful', async () => {
            // Mock user data and successful password comparison
            (getUserByEmail as jest.Mock).mockResolvedValue({
                email: 'test@example.com',
                password: 'hashedPassword',
                isVerified: true,
            });
            (comparePasswords as jest.Mock).mockResolvedValue(true);
            (createSession as jest.Mock).mockResolvedValue(true);

            const req = {
                json: jest.fn().mockResolvedValue({ email: 'test@example.com', password: 'password123' }),
            } as unknown as Request;

            const response = await POST(req);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.message).toBe('Login successful');
        });

        it('should handle server errors gracefully', async () => {
            // Simulate a server error by throwing an exception in one of the functions
            (getUserByEmail as jest.Mock).mockRejectedValue(new Error('Database error'));

            const req = {
                json: jest.fn().mockResolvedValue({ email: 'test@example.com', password: 'password123' }),
            } as unknown as Request;

            const response = await POST(req);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data.message).toBe('Internal Server Error');
        });
    });

    describe('DELETE /api/auth', () => {
        it('should log the user out successfully', async () => {
            // Mock the deleteSession function
            (deleteSession as jest.Mock).mockResolvedValue(true);

            const req = {} as Request;

            const response = await DELETE(req);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.message).toBe('Logout successful');
        });

        it('should handle server errors gracefully on logout', async () => {
            // Simulate a server error during logout
            (deleteSession as jest.Mock).mockRejectedValue(new Error('Session error'));

            const req = {} as Request;

            const response = await DELETE(req);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data.message).toBe('Internal Server Error');
        });
    });
});
