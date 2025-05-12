// tests/api/lessonBooking.test.ts
import { POST } from './route'; // Adjust path if necessary
import { NextResponse } from 'next/server';
import { decrypt } from '@/app/lib/session';
import { getBookedLessonsByUserId } from '@/db/select';
import {cookies} from "next/headers";

// Mock dependencies
jest.mock('@/app/lib/session', () => ({
    decrypt: jest.fn(),
}));

jest.mock('@/db/select', () => ({
    getBookedLessonsByUserId: jest.fn(),
}));

jest.mock('next/headers', () => ({
    cookies: jest.fn(),
}));

describe('POST /api/lessons', () => {
    it('should return lessons for a valid user', async () => {
        // Mock the session decryption
        (decrypt as jest.Mock).mockResolvedValue({ userId: 1 });

        // Mock the cookie
        (cookies as jest.Mock).mockReturnValue({
            get: jest.fn().mockReturnValue({ value: 'valid-session-cookie' }),
        });

        // Mock the database response
        (getBookedLessonsByUserId as jest.Mock).mockResolvedValue([
            { lessonId: 1, date: '2025-05-12', time: '10:00' },
            { lessonId: 2, date: '2025-05-13', time: '14:00' },
        ]);

        // Call the handler
        const req = { json: jest.fn().mockResolvedValue({}) } as unknown as Request;
        const response = await POST(req);

        // Check if the response is successful
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual([
            { lessonId: 1, date: '2025-05-12', time: '10:00' },
            { lessonId: 2, date: '2025-05-13', time: '14:00' },
        ]);
    });

    it('should return 401 if session is invalid', async () => {
        // Mock the session decryption to return null userId
        (decrypt as jest.Mock).mockResolvedValue(null);

        // Mock the cookie
        (cookies as jest.Mock).mockReturnValue({
            get: jest.fn().mockReturnValue({ value: 'invalid-session-cookie' }),
        });

        const req = { json: jest.fn().mockResolvedValue({}) } as unknown as Request;
        const response = await POST(req);

        // Check if the response is Unauthorized
        expect(response.status).toBe(401);
        expect(await response.json()).toEqual({ message: "Not authorized" });
    });

    it('should return 500 if there is a server error', async () => {
        // Mock the session decryption to return a valid userId
        (decrypt as jest.Mock).mockResolvedValue({ userId: 1 });

        // Mock the cookie
        (cookies as jest.Mock).mockReturnValue({
            get: jest.fn().mockReturnValue({ value: 'valid-session-cookie' }),
        });

        // Mock the database to throw an error
        (getBookedLessonsByUserId as jest.Mock).mockRejectedValue(new Error('Database error'));

        const req = { json: jest.fn().mockResolvedValue({}) } as unknown as Request;
        const response = await POST(req);

        // Check if the response is a server error
        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({ message: "Internal Server Error" });
    });
});
