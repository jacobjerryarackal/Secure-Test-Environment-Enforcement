/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // ✅ disable for development
  transpilePackages: ['antd', '@ant-design/icons'],
};

module.exports = nextConfig;