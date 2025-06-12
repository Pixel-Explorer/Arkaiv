import request from 'supertest';
import express from 'express';
import Hashtag from '../../models/Hashtag.js';
import Image from '../../models/Image.js';

jest.mock('../../models/Hashtag.js', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('../../models/Image.js', () => ({
  __esModule: true,
  default: {
    findByIdAndUpdate: jest.fn(),
    find: jest.fn(),
  },
}));

let router: express.Router;
const app = express();
app.use(express.json());

beforeAll(async () => {
  router = (await import('../hashtags.js')).default;
  app.use('/', router);
});

const mockedHashtag = Hashtag as jest.Mocked<typeof Hashtag>;
const mockedImage = Image as jest.Mocked<typeof Image>;

describe('hashtag routes', () => {
  test('GET /hashtags returns list', async () => {
    mockedHashtag.find.mockResolvedValueOnce([{ tag: 'foo' }]);
    const res = await request(app).get('/hashtags');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ tag: 'foo' }]);
  });

  test('POST /images/:imageId/hashtags/:hashtagId adds tag', async () => {
    mockedImage.findByIdAndUpdate.mockResolvedValueOnce({ _id: '1', hashtags: ['2'] } as any);
    const res = await request(app).post('/images/1/hashtags/2');
    expect(res.status).toBe(200);
    expect(mockedImage.findByIdAndUpdate).toHaveBeenCalledWith('1', { $addToSet: { hashtags: '2' } }, { new: true });
    expect(res.body).toEqual({ _id: '1', hashtags: ['2'] });
  });

  test('DELETE /images/:imageId/hashtags/:hashtagId removes tag', async () => {
    mockedImage.findByIdAndUpdate.mockResolvedValueOnce({ _id: '1', hashtags: [] } as any);
    const res = await request(app).delete('/images/1/hashtags/2');
    expect(res.status).toBe(200);
    expect(mockedImage.findByIdAndUpdate).toHaveBeenCalledWith('1', { $pull: { hashtags: '2' } }, { new: true });
    expect(res.body).toEqual({ _id: '1', hashtags: [] });
  });
});
