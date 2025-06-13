import { jest } from '@jest/globals';
jest.unstable_mockModule('../src/models/Image.js', () => ({ default: { create: jest.fn() } }));
jest.unstable_mockModule('../src/models/TokenLedger.js', () => ({ default: { create: jest.fn() } }));
jest.unstable_mockModule('../src/models/User.js', () => ({ default: { findOne: jest.fn() } }));
jest.unstable_mockModule('firebase-admin/storage', () => ({
  Storage: jest.fn().mockImplementation(() => ({
    bucket: jest.fn().mockReturnValue({
      file: jest.fn().mockReturnValue({
        save: jest.fn().mockResolvedValue(undefined)
      })
    })
  }))
}));
jest.unstable_mockModule('../src/utils/ev.js', () => ({
  extractEV: jest.fn(() => 1)
}));

let handler: any;
let Image: any;
let TokenLedger: any;
let User: any;
beforeAll(async () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'key';
  const mod = await import('../src/routes/images.js');
  const router = mod.default;
  Image = (await import('../src/models/Image.js')).default;
  TokenLedger = (await import('../src/models/TokenLedger.js')).default;
  User = (await import('../src/models/User.js')).default;
  const layer = (router as any).stack.find((l: any) => l.route && l.route.path === '/upload-image');
  handler = layer.route.stack[2].handle;
});

describe('upload-image', () => {
  test('creates ledger entry', async () => {
    (Image.create as jest.Mock).mockResolvedValue({ _id: 'img1', userId: 'mongo1', ev: 1, storagePath: 'path' });
    (User.findOne as jest.Mock).mockResolvedValue({ _id: 'mongo1', supabaseId: 'user1' });
    const req: any = { file: { buffer: Buffer.from('data'), originalname: 'a.jpg', mimetype: 'image/jpeg' }, user: { id: 'user1' }, body: {} };
    const res: any = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await handler(req, res);
    const expectedTokens = 1;
    expect(TokenLedger.create).toHaveBeenCalledWith({ userId: 'mongo1', imageId: 'img1', tokens: expectedTokens });
    expect(res.json).toHaveBeenCalledWith({ image: { _id: 'img1', userId: 'mongo1', ev: 1, storagePath: 'path' }, tokens: expectedTokens });
  });
});
