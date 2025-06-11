import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function authenticate(req, res, next) {
  try {
    const header = req.header('Authorization') || '';
    const token = header.startsWith('Bearer ')
      ? header.slice(7).trim()
      : header || req.header('sb-access-token') || req.header('session');

    if (!token) {
      return res.status(401).json({ error: 'Missing auth token' });
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid auth token' });
    }

    req.user = data.user;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Authentication failed' });
  }
}
