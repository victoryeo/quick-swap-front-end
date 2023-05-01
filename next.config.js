/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    newNextLinkBehavior: false,
  },
  env: {
    REACT_APP_WEB3_PROVIDER_HTTPS: process.env.REACT_APP_WEB3_PROVIDER_HTTPS
  }
}

module.exports = nextConfig
