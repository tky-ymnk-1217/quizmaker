<template>
  <div style="min-height: 100vh; background-color: #f3f4f6; font-family: Arial, sans-serif;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 2rem;">
      <header style="text-align: center; margin-bottom: 3rem;">
        <h1 style="font-size: 2.5rem; font-weight: bold; color: #1f2937; margin-bottom: 1rem;">
          クイズメーカー
        </h1>
        <p style="font-size: 1.125rem; color: #4b5563;">
          クイズを作成して、みんなで楽しもう！
        </p>
      </header>

      <div style="max-width: 900px; margin: 0 auto;">
        <div style="background: white; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 1.5rem; margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">利用可能な機能</h2>
          <ul style="list-style: none; padding: 0;">
            <li style="display: flex; align-items: center; margin-bottom: 0.5rem;">
              <span style="color: #10b981; margin-right: 0.5rem;">✓</span>
              クイズの作成と編集
            </li>
            <li style="display: flex; align-items: center; margin-bottom: 0.5rem;">
              <span style="color: #10b981; margin-right: 0.5rem;">✓</span>
              クイズの検索と閲覧
            </li>
            <li style="display: flex; align-items: center; margin-bottom: 0.5rem;">
              <span style="color: #10b981; margin-right: 0.5rem;">✓</span>
              クイズへの回答とスコア表示
            </li>
          </ul>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
          <div style="background: white; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 1.5rem;">
            <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem;">クイズを探す</h3>
            <p style="color: #4b5563; margin-bottom: 1rem;">
              様々なジャンルのクイズから好きなものを選んで挑戦しよう
            </p>
            <button style="width: 100%; background-color: #3b82f6; color: white; font-weight: 600; padding: 0.5rem 1rem; border-radius: 0.25rem; border: none; cursor: pointer;">
              クイズ一覧へ
            </button>
          </div>

          <div style="background: white; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 1.5rem;">
            <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem;">クイズを作成</h3>
            <p style="color: #4b5563; margin-bottom: 1rem;">
              自分だけのオリジナルクイズを作成して共有しよう
            </p>
            <button style="width: 100%; background-color: #10b981; color: white; font-weight: 600; padding: 0.5rem 1rem; border-radius: 0.25rem; border: none; cursor: pointer;">
              作成を始める
            </button>
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
      // データをここに追加
    }
  },
  async mounted() {
    try {
      // APIからデータを取得する例
      // const response = await this.$axios.get('/quizzes')
      // console.log(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
}
</script>
