<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
    <!-- ヘッダー -->
    <header class="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 shadow-lg">
      <div class="max-w-screen-xl mx-auto px-4 py-6">
        <nuxt-link to="/" class="inline-flex items-center gap-2 text-white hover:scale-105 transform transition-transform">
          <span class="text-3xl">🎯</span>
          <span class="text-2xl font-extrabold drop-shadow-lg">クイズメーカー</span>
        </nuxt-link>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="flex-1">
      <div class="max-w-screen-xl mx-auto px-4 py-8">
        <nuxt />
      </div>
    </main>

    <!-- フッター -->
    <footer class="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 mt-auto">
      <div class="max-w-screen-xl mx-auto px-4 py-6 text-center">
        <p class="text-white font-bold">💖 &copy; 2026 クイズメーカー 💖</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout'
}
</script>
