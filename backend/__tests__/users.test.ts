import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/models/User.js', () => ({
  default: { create: jest.fn(), findOne: jest.fn() }
}));

jest.unstable_mockModule('../src/models/TokenLedger.js', () => ({
  default: { aggregate: jest.fn(), find: jest.fn() }
}));

let registerHandler: any;
let statsHandler: any;
let archiveHandler: any;
let User: any;
let TokenLedger: any;

beforeAll(async () => {
  const mod = await import('../src/routes/users.js');
  const router = mod.default;
  User = (await import('../src/models/User.js')).default;
  TokenLedger = (await import('../src/models/TokenLedger.js')).default;

  const regLayer = (router as any).stack.find((l: any) => l.route && l.route.path === '/register-user');
  registerHandler = regLayer.route.stack[0].handle;

  const statsLayer = (router as any).stack.find((l: any) => l.route && l.route.path === '/creator-stats/:id');
  statsHandler = statsLayer.route.stack[0].handle;

  const archiveLayer = (router as any).stack.find((l: any) => l.route && l.route.path === '/archive');
  archiveHandler = archiveLayer.route.stack[0].handle;
});

describe('register-user', () => {
  test('creates user', async () => {
    const user = { _id: 'mongo1', email: 'a', name: 'b', supabaseId: 'sup1' };
    (User.create as jest.Mock).mockResolvedValue(user);
    const req: any = { body: { email: 'a', name: 'b', supabaseId: 'sup1' } };
    const res: any = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await registerHandler(req, res);
    expect(User.create).toHaveBeenCalledWith({ email: 'a', name: 'b', supabaseId: 'sup1' });
    expect(res.json).toHaveBeenCalledWith(user);
  });
});

describe('creator-stats', () => {
  test('returns aggregated stats', async () => {
    const user = { _id: 'mongo1', supabaseId: 'user1' };
    (User.findOne as jest.Mock).mockResolvedValue(user);
    (TokenLedger.aggregate as jest.Mock).mockResolvedValue([{ _id: 'mongo1', tokens: 5 }]);
    const limitMock = jest.fn().mockResolvedValue([{ id: 't1' }]);
    const sortMock = jest.fn().mockReturnValue({ limit: limitMock });
    (TokenLedger.find as jest.Mock).mockReturnValue({ sort: sortMock });
    const req: any = { params: { id: 'user1' } };
    const res: any = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await statsHandler(req, res);
    expect(res.json).toHaveBeenCalledWith({ supabaseId: 'user1', totalTokens: 5, transactions: [{ id: 't1' }] });
    expect(TokenLedger.find).toHaveBeenCalledWith({ userId: 'mongo1' });
    expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
    expect(limitMock).toHaveBeenCalledWith(10);
  });
});

describe('archive', () => {
  test('returns not implemented', async () => {
    const req: any = {};
    const res: any = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await archiveHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(501);
    expect(res.json).toHaveBeenCalledWith({ error: 'Not implemented' });
  });
});
