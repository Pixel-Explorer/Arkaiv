import { jest } from '@jest/globals';
jest.unstable_mockModule('../src/models/User.js', () => ({ default: { findOne: jest.fn() } }));

let handler: any;
let User: any;

beforeAll(async () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'key';
  const mod = await import('../src/routes/users.js');
  const router = mod.default;
  User = (await import('../src/models/User.js')).default;
  const layer = (router as any).stack.find((l: any) => l.route && l.route.path === '/archive');
  handler = layer.route.stack[1].handle;
});

describe('archive', () => {
  test('adds entry to user history', async () => {
    const save = jest.fn();
    const userDoc = { _id: 'mongo1', supabaseId: 'user1', history: [], save };
    (User.findOne as jest.Mock).mockResolvedValue(userDoc);
    const req: any = { body: { text: 'hello' }, user: { id: 'user1' } };
    const res: any = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await handler(req, res);
    expect(userDoc.history[0].text).toBe('hello');
    expect(save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ text: 'hello' }));
  });
});
