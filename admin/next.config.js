/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  reactStrictMode: true,

  // 開発時はoutput: 'export'を無効化（Docker権限エラー回避）
  ...(isProd && {
    output: 'export',
    basePath: '/admin',
    assetPrefix: '/admin',
  }),

  // API接続の設定
  env: {
    API_URL: process.env.API_URL || 'http://localhost:8000/api',
  },
}

module.exports = nextConfig
