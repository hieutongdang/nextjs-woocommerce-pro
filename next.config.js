/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [process.env.NEXT_PUBLIC_SITE_DOMAIN],
  },
};

module.exports = nextConfig; 