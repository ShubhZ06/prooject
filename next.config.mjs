/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy /api requests from the Next dev server to the Express backend.
  // In development we default to http://localhost:5000.
  // In production (e.g. on Vercel) you MUST set API_PROXY_TARGET to your deployed backend URL,
  // otherwise no /api rewrite will be configured.
  async rewrites() {
    const isDev = process.env.NODE_ENV === 'development';
    const target =
      process.env.API_PROXY_TARGET || (isDev ? 'http://localhost:5000' : undefined);

    if (!target) {
      // In production without API_PROXY_TARGET we skip rewrites completely so that
      // Vercel doesn't try to proxy to localhost.
      return [];
    }

    return [
      {
        source: '/api/:path*',
        destination: `${target}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
