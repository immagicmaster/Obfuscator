export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    if (url.pathname === '/api/deobfuscate' && request.method === 'POST') {
      try {
        const resp = await fetch('https://leakd-detector.up.railway.app/prometheus', {
          method: 'POST',
          body: request.body,
          headers: {
            'content-type': request.headers.get('content-type') || '',
          },
        });

        const newHeaders = new Headers(resp.headers);
        newHeaders.set('Access-Control-Allow-Origin', '*');

        return new Response(resp.body, {
          status: resp.status,
          headers: newHeaders,
        });
      } catch (err) {
        return new Response('Proxy Error: ' + err.message, {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    return new Response('Not Found', {
      status: 404,
      headers: corsHeaders,
    });
  },
};
