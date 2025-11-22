/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy /api requests from the Next dev server to the Express backend.
  // From the browser's perspective everything is on the same origin/port.
  async rewrites() {
    const target = process.env.API_PROXY_TARGET || 'http://localhost:5000';
    return [
      {
        source: '/api/:path*',
        destination: `${target}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
