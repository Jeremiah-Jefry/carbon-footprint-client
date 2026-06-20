import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { api } from './index';

vi.mock('firebase-admin', () => {
  const firestoreMock = {
    collection: vi.fn().mockReturnThis(),
    doc: vi.fn().mockReturnThis(),
    set: vi.fn().mockResolvedValue(true),
    get: vi.fn().mockResolvedValue({
      exists: false,
      docs: [],
      data: () => ({})
    }),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
  };

  return {
    initializeApp: vi.fn(),
    firestore: Object.assign(() => firestoreMock, {
      FieldValue: {
        serverTimestamp: vi.fn().mockReturnValue('MOCK_TIMESTAMP'),
      }
    }),
  };
});

describe('API Endpoints', () => {
  const mockToken = 'test-token';
  const expressApp = api as any;

  it('should reject unauthenticated requests', async () => {
    const res = await request(expressApp).get('/gamification');
    expect(res.status).toBe(401);
  });

  it('should calculate footprint and log activity', async () => {
    const payload = {
      date: '2023-10-10',
      inputs: {
        transportation: { gas_car: 10 },
        diet: {},
        energy: {}
      }
    };

    const res = await request(expressApp)
      .post('/log')
      .set('Authorization', `Bearer ${mockToken}`)
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.totalKgCO2e).toBeDefined();
    expect(res.body.totalKgCO2e).toBe(1.7);
  });

  it('should fetch gamification state', async () => {
    const res = await request(expressApp)
      .get('/gamification')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.status).toBe(200);
    expect(res.body.totalXP).toBe(0);
  });

  it('should fetch leaderboard and return fallback data if empty', async () => {
    const res = await request(expressApp)
      .get('/leaderboard')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.status).toBe(200);
    expect(res.body.leaderboard).toBeDefined();
    expect(res.body.leaderboard.length).toBe(3);
  });
});
