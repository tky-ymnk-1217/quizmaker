<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-extrabold text-gray-800">🎯 クイズに挑戦！</h1>
      <button @click="$router.push('/')" class="px-6 py-3 bg-purple-500 text-white rounded-full font-bold shadow-lg hover:scale-110 hover:bg-purple-600 transform transition-all">
        ← 戻る
      </button>
    </div>

    <div>
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">読み込み中...</p>
      </div>

      <div v-else-if="quiz" class="max-w-3xl mx-auto">
        <!-- クイズ情報 -->
        <div class="bg-gradient-to-r from-purple-200 to-pink-200 rounded-3xl shadow-xl p-8 mb-8 border-4 border-white">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h2 class="text-3xl font-black text-gray-800 mb-3">📚 {{ quiz.title }}</h2>
              <p v-if="quiz.description" class="text-gray-700 text-lg mb-4">{{ quiz.description }}</p>
            </div>
            <div class="text-5xl ml-4">🎯</div>
          </div>
          <div class="flex gap-3 flex-wrap">
            <span class="bg-white px-4 py-2 rounded-full font-bold text-sm text-purple-600 shadow">
              👤 {{ quiz.user.name }}
            </span>
            <span class="bg-white px-4 py-2 rounded-full font-bold text-sm text-pink-600 shadow">
              📝 {{ quiz.questions.length }}問
            </span>
            <span class="bg-white px-4 py-2 rounded-full font-bold text-sm text-blue-600 shadow">
              👁 {{ quiz.view_count }}回
            </span>
          </div>
        </div>

        <!-- 問題一覧 -->
        <div v-for="(question, qIndex) in quiz.questions" :key="question.id" class="bg-white rounded-3xl shadow-xl p-6 mb-6 border-4 border-purple-100 transform transition-all hover:scale-102">
          <div class="flex items-center gap-3 mb-4">
            <div class="bg-gradient-to-br from-purple-400 to-pink-400 text-white rounded-full w-12 h-12 flex items-center justify-center font-black text-lg shadow-lg">
              {{ qIndex + 1 }}
            </div>
            <h3 class="text-xl font-black text-gray-800 flex-1">
              問題 {{ qIndex + 1 }}
            </h3>
            <span class="bg-yellow-200 px-4 py-2 rounded-full font-bold text-sm text-yellow-800 shadow">
              ⭐ {{ question.points }}点
            </span>
          </div>
          <p class="text-gray-800 text-lg mb-6 font-semibold bg-purple-50 p-4 rounded-2xl">{{ question.question_text }}</p>

          <div class="space-y-3">
            <div
              v-for="(answer, aIndex) in question.answers"
              :key="answer.id"
              class="flex items-center gap-3 p-4 border-3 rounded-2xl cursor-pointer transform transition-all hover:scale-105 hover:shadow-lg"
              :class="{
                'bg-green-100 border-green-400 shadow-lg': showAnswers && answer.is_correct,
                'bg-red-100 border-red-400': showAnswers && selectedAnswers[qIndex] === aIndex && !answer.is_correct,
                'bg-blue-50 border-blue-400 shadow-md': !showAnswers && selectedAnswers[qIndex] === aIndex,
                'bg-white border-gray-200': !showAnswers && selectedAnswers[qIndex] !== aIndex && !(showAnswers && answer.is_correct)
              }"
              @click="selectAnswer(qIndex, aIndex)"
            >
              <div class="flex-shrink-0">
                <div class="w-6 h-6 rounded-full border-3 flex items-center justify-center"
                  :class="{
                    'bg-green-400 border-green-600': showAnswers && answer.is_correct,
                    'bg-red-400 border-red-600': showAnswers && selectedAnswers[qIndex] === aIndex && !answer.is_correct,
                    'bg-blue-400 border-blue-600': !showAnswers && selectedAnswers[qIndex] === aIndex,
                    'bg-white border-gray-300': !showAnswers && selectedAnswers[qIndex] !== aIndex && !(showAnswers && answer.is_correct)
                  }"
                >
                  <span v-if="selectedAnswers[qIndex] === aIndex || (showAnswers && answer.is_correct)" class="text-white font-bold text-sm">✓</span>
                </div>
              </div>
              <label class="flex-1 cursor-pointer font-semibold text-gray-800">
                {{ answer.answer_text }}
              </label>
              <span v-if="showAnswers && answer.is_correct" class="text-green-600 font-black text-lg">🎉</span>
            </div>
          </div>

          <!-- 正解の解説 -->
          <div v-if="showAnswers && question.explanation" class="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
            <div class="flex items-start gap-2">
              <span class="text-2xl">💡</span>
              <div class="flex-1">
                <h4 class="font-bold text-blue-800 mb-1">解説</h4>
                <p class="text-gray-700">{{ question.explanation }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 採点ボタン -->
        <div class="bg-gradient-to-r from-blue-200 to-purple-200 rounded-3xl shadow-xl p-8 border-4 border-white sticky bottom-4">
          <button
            v-if="!showAnswers"
            @click="checkAnswers"
            :disabled="!canSubmit"
            class="w-full py-4 rounded-full font-black text-xl text-white shadow-lg transform transition-all"
            :class="canSubmit ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 hover:shadow-2xl' : 'bg-gray-400 cursor-not-allowed'"
          >
            {{ canSubmit ? '🎯 採点する！' : '⏳ 全ての問題に回答してね' }}
          </button>

          <div v-else class="text-center">
            <div class="text-7xl mb-4 animate-bounce">🎊</div>
            <h3 class="text-3xl font-black text-gray-800 mb-4">お疲れ様でした！</h3>
            <div class="bg-white rounded-3xl p-6 mb-6 shadow-lg">
              <p class="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
                {{ score }} / {{ totalPoints }}
              </p>
              <p class="text-2xl font-bold text-gray-700">
                🎯 {{ correctCount }} / {{ quiz.questions.length }} 問正解！
              </p>
              <p class="text-lg text-gray-600 mt-2">{{ getResultMessage() }}</p>
            </div>
            <button
              @click="resetQuiz"
              class="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-full hover:scale-110 transform transition-all font-black text-lg shadow-lg"
            >
              🔄 もう一度挑戦！
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuizDetailPage',
  data() {
    return {
      quiz: null,
      loading: true,
      selectedAnswers: {},
      showAnswers: false,
      score: 0,
      correctCount: 0
    }
  },
  computed: {
    canSubmit() {
      if (!this.quiz) return false
      return Object.keys(this.selectedAnswers).length === this.quiz.questions.length
    },
    totalPoints() {
      if (!this.quiz) return 0
      return this.quiz.questions.reduce((sum, q) => sum + q.points, 0)
    }
  },
  async mounted() {
    await this.fetchQuiz()
  },
  methods: {
    async fetchQuiz() {
      try {
        const id = this.$route.params.id
        const apiBaseUrl = this.$config.apiBaseUrl || '/api'
        const response = await fetch(`${apiBaseUrl}/public/quizzes/${id}`)
        const data = await response.json()
        this.quiz = data.quiz
      } catch (error) {
        console.error('クイズの取得に失敗しました', error)
        alert('クイズの取得に失敗しました')
        this.$router.push('/')
      } finally {
        this.loading = false
      }
    },
    selectAnswer(questionIndex, answerIndex) {
      if (this.showAnswers) return
      this.$set(this.selectedAnswers, questionIndex, answerIndex)
    },
    checkAnswers() {
      this.showAnswers = true
      this.score = 0
      this.correctCount = 0

      this.quiz.questions.forEach((question, qIndex) => {
        const selectedIndex = this.selectedAnswers[qIndex]
        if (selectedIndex !== undefined) {
          const selectedAnswer = question.answers[selectedIndex]
          if (selectedAnswer && selectedAnswer.is_correct) {
            this.score += question.points
            this.correctCount++
          }
        }
      })
    },
    resetQuiz() {
      this.selectedAnswers = {}
      this.showAnswers = false
      this.score = 0
      this.correctCount = 0
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    getResultMessage() {
      if (!this.quiz) return ''
      const percentage = (this.correctCount / this.quiz.questions.length) * 100
      if (percentage === 100) return '🎉 パーフェクト！すごい！'
      if (percentage >= 80) return '🌟 素晴らしい！'
      if (percentage >= 60) return '👍 よくできました！'
      if (percentage >= 40) return '💪 もう少し！頑張って！'
      return '📚 次は頑張ろう！'
    }
  }
}
</script>
