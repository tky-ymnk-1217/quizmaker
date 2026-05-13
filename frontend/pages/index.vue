<template>
  <div>
    <div class="mb-8">
      <h1 class="text-4xl font-extrabold text-gray-800 mb-2">✨ 楽しいクイズに挑戦しよう！</h1>
      <p class="text-gray-600">気になるクイズをクリックして挑戦してね</p>
    </div>

    <div>
      <div v-if="loading" class="text-center py-16">
        <div class="text-6xl mb-4 animate-bounce">🎪</div>
        <p class="text-purple-600 text-lg font-bold">読み込み中...</p>
      </div>

      <div v-else-if="quizzes.length === 0" class="text-center py-16 bg-white rounded-3xl shadow-xl border-4 border-dashed border-purple-300">
        <div class="text-6xl mb-4">📝</div>
        <p class="text-gray-600 text-xl font-bold">公開されているクイズがまだありません</p>
        <p class="text-gray-500 mt-2">もうすぐ楽しいクイズが登場するよ！</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(quiz, index) in quizzes"
          :key="quiz.id"
          class="quiz-card rounded-3xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden"
          :class="getCardColor(index)"
          @click="goToQuiz(quiz.id)"
        >
          <div class="p-6 relative">
            <div class="absolute top-4 right-4 text-3xl opacity-20">
              {{ getEmoji(index) }}
            </div>
            <h2 class="text-2xl font-black text-gray-800 mb-3 relative z-10">
              {{ quiz.title }}
            </h2>
            <p v-if="quiz.description" class="text-gray-700 text-sm mb-4 line-clamp-2 relative z-10 whitespace-pre-line">
              {{ quiz.description }}
            </p>
            <div class="flex items-center justify-between text-sm mb-4">
              <span class="bg-white bg-opacity-70 px-3 py-1 rounded-full font-semibold text-gray-700">
                👤 {{ quiz.user.name }}
              </span>
              <span class="bg-white bg-opacity-70 px-3 py-1 rounded-full font-semibold text-gray-700">
                👁 {{ quiz.view_count }}
              </span>
            </div>
            <div class="mt-6 text-center">
              <span class="inline-block bg-white text-purple-600 text-sm font-bold px-6 py-3 rounded-full shadow-lg transform transition-transform hover:scale-110">
                🎮 クイズに挑戦 →
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      quizzes: [],
      loading: true
    }
  },
  async mounted() {
    await this.fetchQuizzes()
  },
  methods: {
    async fetchQuizzes() {
      try {
        const apiBaseUrl = this.$config.apiBaseUrl || '/api'
        const response = await fetch(`${apiBaseUrl}/public/quizzes`)
        const data = await response.json()
        this.quizzes = data.quizzes || []
      } catch (error) {
        console.error('クイズの取得に失敗しました', error)
      } finally {
        this.loading = false
      }
    },
    goToQuiz(id) {
      this.$router.push(`/quizzes/${id}`)
    },
    getCardColor(index) {
      const colors = [
        'bg-gradient-to-br from-pink-200 to-pink-300',
        'bg-gradient-to-br from-purple-200 to-purple-300',
        'bg-gradient-to-br from-blue-200 to-blue-300',
        'bg-gradient-to-br from-green-200 to-green-300',
        'bg-gradient-to-br from-yellow-200 to-yellow-300',
        'bg-gradient-to-br from-red-200 to-red-300'
      ]
      return colors[index % colors.length]
    },
    getEmoji(index) {
      const emojis = ['🎯', '🎪', '🎨', '🎭', '🎬', '🎤', '🎸', '🎹', '🎲', '🎮']
      return emojis[index % emojis.length]
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
