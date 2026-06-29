/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
    serverComponentsExternalPackages: [
      "googleapis",
      "google-auth-library",
      "exceljs",
      "node-cron",
      "async-mutex",
    ],
  },
};

module.exports = nextConfig;
