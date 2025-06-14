/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['nextjs.danghieu.com'],
  },
  async redirects() {
    return [
      {
        source: '/(.*)',
        has: [
          {
            type: 'host',
            value: 'cuanhua.com.vn',
          },
        ],
        destination: 'https://cuanhua.com.vn/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
