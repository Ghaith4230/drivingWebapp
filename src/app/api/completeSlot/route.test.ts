import { POST } from './route'; // Adjust the import based on the actual path of the file
import { getTimeSlotsByDate } from '@/db/select';
import { completeTimeSlot, updateTimeSlot } from '@/db/queries/insert';
import { NextRequest } from 'next/server';

// Mock dependencies
jest.mock('@/db/select', () => ({
    getTimeSlotsByDate: jest.fn(),
}));

jest.mock('@/db/queries/insert', () => ({
    completeTimeSlot: jest.fn(),
    updateTimeSlot: jest.fn(),
}));

describe('POST /completeSlot', () => {
    // Helper function to create a mock request
    const mockRequest = (data: any): NextRequest => {
        return new Request('http://localhost', {
            method: 'POST',
            body: JSON.stringify(data), // Add the body with the necessary data
        }) as NextRequest;
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns 403 if the role is not faculty', async () => {
        const response = await POST(mockRequest({ role: 'student', date: '2025-05-12', time: '09:00' }));

        expect(response.status).toBe(403);
        expect(await response.json()).toEqual({ error: "Only faculty may mark slots completed/uncompleted." });
    });

    it('returns 404 if the time slot is not found', async () => {
        (getTimeSlotsByDate as jest.Mock).mockResolvedValueOnce([]); // No slots found

        const response = await POST(mockRequest({ role: 'faculty', date: '2025-05-12', time: '09:00' }));

        expect(response.status).toBe(404);
        expect(await response.json()).toEqual({ error: "Timeslot not found." });
    });

    it('marks the time slot as completed if it is not already completed', async () => {
        const mockSlot = { time: '09:00', status: 'booked', bookedBy: 123 };
        (getTimeSlotsByDate as jest.Mock).mockResolvedValueOnce([mockSlot]); // Slot found

        const response = await POST(mockRequest({ role: 'faculty', date: '2025-05-12', time: '09:00' }));

        expect(completeTimeSlot).toHaveBeenCalledWith('2025-05-12', '09:00');
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ ok: true, status: 'completed' });
    });

    it('undos the completion and sets the slot back to booked or scheduled', async () => {
        const mockSlot = { time: '09:00', status: 'completed', bookedBy: 123 };
        (getTimeSlotsByDate as jest.Mock).mockResolvedValueOnce([mockSlot]); // Slot found

        const response = await POST(mockRequest({ role: 'faculty', date: '2025-05-12', time: '09:00' }));

        expect(updateTimeSlot).toHaveBeenCalledWith('2025-05-12', '09:00', { status: 'booked' });
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ ok: true, status: 'booked' });
    });

    it('sets the slot to scheduled if it is completed and not booked by anyone', async () => {
        const mockSlot = { time: '09:00', status: 'completed', bookedBy: null };
        (getTimeSlotsByDate as jest.Mock).mockResolvedValueOnce([mockSlot]); // Slot found

        const response = await POST(mockRequest({ role: 'faculty', date: '2025-05-12', time: '09:00' }));

        expect(updateTimeSlot).toHaveBeenCalledWith('2025-05-12', '09:00', { status: 'scheduled' });
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ ok: true, status: 'scheduled' });
    });
});
