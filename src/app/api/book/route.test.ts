import { POST } from './route'; // Adjust the path based on where your `route.ts` is located
import { NextResponse } from 'next/server';
import { decrypt } from '@/app/lib/session';
import { updateTimeSlot } from '@/db/queries/insert';
import { cookies } from 'next/headers';

jest.mock('@/app/lib/session');
jest.mock('@/db/queries/insert');
jest.mock('next/headers');

describe('POST /api/book', () => {
    it('should successfully book a time slot when valid data is provided and session is valid', async () => {
        // Mock session and cookie
        const mockCookie = { value: 'mocked-session' };
        const mockSession = { userId: 123 };

        // Mock the decrypt function
        (decrypt as jest.Mock).mockResolvedValue(mockSession);

        // Mock the cookies function
        (cookies as jest.Mock).mockResolvedValue({ get: jest.fn().mockReturnValue(mockCookie) });

        // Mock the updateTimeSlot function
        (updateTimeSlot as jest.Mock).mockResolvedValue({});

        // Mock the request body
        const mockRequest = {
            json: jest.fn().mockResolvedValue({
                date: '2025-05-13',
                time: '10:00 AM',
                details: 'Sample booking details',
            }),
        };

        const response = await POST(mockRequest as any);

        const responseBody = await response.json(); // Extract JSON from the response

        expect(response.status).toBe(200);
        expect(responseBody.message).toBe('Time slot booked successfully.');
        expect(updateTimeSlot).toHaveBeenCalledWith(
            '2025-05-13',
            '10:00 AM',
            { bookedBy: 123 }
        );
    });

    it('should return 401 if the session is invalid or expired', async () => {
        // Mock session as null to simulate invalid session
        (decrypt as jest.Mock).mockResolvedValue(null);

        // Mock the cookies function
        const mockCookie = { value: 'mocked-session' };
        (cookies as jest.Mock).mockResolvedValue({ get: jest.fn().mockReturnValue(mockCookie) });

        // Mock the request body
        const mockRequest = {
            json: jest.fn().mockResolvedValue({
                date: '2025-05-13',
                time: '10:00 AM',
                details: 'Sample booking details',
            }),
        };

        const response = await POST(mockRequest as any);

        const responseBody = await response.json(); // Extract JSON from the response

        expect(response.status).toBe(401);
        expect(responseBody.message).toBe('User not found or session expired.');
    });

    it('should return 500 if an error occurs during database insertion', async () => {
        // Mock valid session and cookie
        const mockCookie = { value: 'mocked-session' };
        const mockSession = { userId: 123 };

        // Mock the decrypt function
        (decrypt as jest.Mock).mockResolvedValue(mockSession);

        // Mock the cookies function
        (cookies as jest.Mock).mockResolvedValue({ get: jest.fn().mockReturnValue(mockCookie) });

        // Mock the updateTimeSlot function to throw an error
        (updateTimeSlot as jest.Mock).mockRejectedValue(new Error('Database error'));

        // Mock the request body
        const mockRequest = {
            json: jest.fn().mockResolvedValue({
                date: '2025-05-13',
                time: '10:00 AM',
                details: 'Sample booking details',
            }),
        };

        const response = await POST(mockRequest as any);

        const responseBody = await response.json(); // Extract JSON from the response

        expect(response.status).toBe(500);
        expect(responseBody.message).toBe('Internal Server Error');
    });
});
