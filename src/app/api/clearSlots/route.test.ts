import { jest } from '@jest/globals';

// Mocks for database and session
const whereMock = jest.fn();
const deleteMock = jest.fn(() => ({ where: whereMock }));

// Mocking database interaction (adjust according to actual file structure)
jest.mock('@/db', () => ({
    db: {
        delete: deleteMock,
    },
}));

// Mocking drizzle-orm's eq function
jest.mock('drizzle-orm', () => ({
    eq: jest.fn(),
}));

// Mocking the session library globally
jest.mock('@/app/lib/session', () => ({
    getSession: jest.fn(),
}));

describe('POST /clear-slots', () => {
    let POST: any;
    let getSession: any;
    let eq: any;
    let postsTable: any;

    const mockRequest = {} as any;

    beforeAll(async () => {
        // Ensure mocks are set up before dynamic imports
        const sessionMod = await import('@/app/lib/session');
        getSession = sessionMod.getSession;

        const drizzle = await import('drizzle-orm');
        eq = drizzle.eq;

        ({ postsTable } = await import('@/db/schema')); // Adjust to your actual schema

        // Dynamically import the route after the mocks are set
        const route = await import('./route');
        POST = route.POST;
    });

    beforeEach(() => {
        jest.clearAllMocks();  // Clear mocks between tests to avoid interference
    });

    it('returns 401 if user is not authenticated', async () => {
        // Mock session to simulate unauthenticated user
        getSession.mockResolvedValue(null);

        const response = await POST(mockRequest);
        expect(response.status).toBe(401);  // Unauthorized if not authenticated
    });

    //delete test
    it('deletes user slots and returns success', async () => {
        const mockUserId = 123;
        // Mock session with user ID
        getSession.mockResolvedValue({ user: { id: mockUserId } });

        const response = await POST(mockRequest);

        // Check that the delete function was called with the postsTable
        expect(deleteMock).toHaveBeenCalledWith(postsTable);
        // Ensure that the eq function was used for filtering by user ID
        expect(eq).toHaveBeenCalledWith(postsTable.userId, mockUserId);
        // Ensure where function was called on the mock
        expect(whereMock).toHaveBeenCalled();
        expect(response.status).toBe(200);  // Success if the deletion works
    });

    it('returns 500 on DB error', async () => {
        // Simulate a DB failure
        getSession.mockResolvedValue({ user: { id: 1 } });
        whereMock.mockImplementationOnce(() => {
            throw new Error('DB failure');  // Simulate a database error
        });

        const response = await POST(mockRequest);
        expect(response.status).toBe(500);  // Internal Server Error in case of failure
    });
});
