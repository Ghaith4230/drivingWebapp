import { jest } from '@jest/globals';

const whereMock = jest.fn();
const deleteMock = jest.fn(() => ({ where: whereMock }));

jest.mock('@/db', () => ({
    db: {
        delete: deleteMock,
    },
}));

jest.mock('drizzle-orm', () => ({
    eq: jest.fn(),
}));

jest.mock('@/app/lib/session', () => ({
    getSession: jest.fn(), // Simple mock function
}));

describe('POST /clear-slots', () => {
    let POST: any;
    let getSession: any;
    let eq: any;
    let postsTable: any;

    const mockRequest = {} as any;

    beforeAll(async () => {
        // Dynamically import after mocking
        const route = await import('./route');
        POST = route.POST;

        const sessionMod = await import('@/app/lib/session');
        getSession = sessionMod.getSession;

        const drizzle = await import('drizzle-orm');
        eq = drizzle.eq;

        ({ postsTable } = await import('@/db/schema'));
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns 401 if user is not authenticated', async () => {
        getSession.mockResolvedValue(null);  // Use mockResolvedValue directly here

        const response = await POST(mockRequest);
        expect(response.status).toBe(401);
    });

    it('deletes user slots and returns success', async () => {
        const mockUserId = 123;
        getSession.mockResolvedValue({ user: { id: mockUserId } });  // Mock session with user id

        const response = await POST(mockRequest);

        expect(deleteMock).toHaveBeenCalledWith(postsTable);
        expect(eq).toHaveBeenCalledWith(postsTable.userId, mockUserId);
        expect(whereMock).toHaveBeenCalled();
        expect(response.status).toBe(200);
    });

    it('returns 500 on DB error', async () => {
        getSession.mockResolvedValue({ user: { id: 1 } });
        whereMock.mockImplementationOnce(() => {
            throw new Error('DB failure');
        });

        const response = await POST(mockRequest);
        expect(response.status).toBe(500);
    });
});
