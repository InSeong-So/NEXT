/** @type {import('next').NextConfig} */
module.exports = {
  api: {
    externalResolver: true,
  },
  reactStrictMode: true,
  experimental: {
    externalDir: true,
    outputStandalone: true,
  },
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // eslint-disable-next-line no-shadow
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
