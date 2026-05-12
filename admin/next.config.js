/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  reactStrictMode: true,

  env: {
    API_URL: process.env.API_URL || 'http://localhost:8000/api',
  },

  output: 'export',

  ...(isProd && {
    basePath: '/admin',
    assetPrefix: '/admin/',
  }),
}

module.exports = nextConfig