// /api/img-proxy.js
export const config = { runtime: 'edge' };

export default async (req) => {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  if (!url) return new Response('Missing url', { status: 400 });

  const r = await fetch(url, { redirect: 'follow' });
  if (!r.ok) return new Response('Bad upstream', { status: r.status });

  return new Response(r.body, {
    headers: {
      'Content-Type': r.headers.get('content-type') || 'image/octet-stream',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
