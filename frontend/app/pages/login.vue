<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth'; 
import { useForm } from 'vee-validate'; // VeeValidateをインポート
import { loginSchema } from '../schemas/authSchema'; // ログインスキーマをインポート
import { useRouter } from 'vue-router'; // 💡 Nuxt Router をインポート

// レイアウトを 'auth' に指定
definePageMeta({
  layout: 'auth',
});

const authStore = useAuthStore();
const router = useRouter(); // 💡 useRouter を初期化

// --- VeeValidate の導入 ---
const { defineField, handleSubmit: veeValidateHandleSubmit, errors, isSubmitting } = useForm({
  validationSchema: loginSchema, // ログインスキーマを使用
  initialValues: {
    email: '',
    password: '',
  },
});

// 各フォームフィールドを定義
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

// API全体エラーメッセージの状態
const apiError = ref(''); 

// --- フォーム送信処理のロジック変更 ---
const handleSubmit = veeValidateHandleSubmit(async (values) => {
  apiError.value = ''; // APIエラーをリセット
  
  try {
    // VeeValidateで検証済みの値 (values) を使用
    await authStore.login(values);
    
    // 💡 認証ストアのログイン処理が成功した場合、トップページへリダイレクト
    // 商品一覧が表示されるのはルートパス ('/') です
    router.push('/'); 

  } catch (error: any) {
    // APIからのエラーレスポンスを処理
    if (error.response && error.response.status === 422) {
      // Laravelのバリデーションエラー
      const validationErrors = error.response._data.errors;
      
      // ログインリクエストで認証失敗時 ('email'キーにエラーが返る) の処理
      if (validationErrors?.email) {
        // APIから返されたエラーメッセージ（例: ログイン情報が登録されていません）を表示
        apiError.value = validationErrors.email[0]; 
      } else {
        apiError.value = '入力内容に問題があります。再度ご確認ください。';
      }
    } else {
      apiError.value = 'ログインに失敗しました。時間をおいて再度お試しください。';
    }
  }
});
</script>

<template>
  <!-- Login Box: 白い背景、角丸、シャドウ、最大幅設定 -->
  <div class="w-full max-w-xl p-8 bg-white rounded-lg shadow-xl">
    
    <!-- Title -->
    <h2 class="text-center text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
      ログイン
    </h2>

    <!-- API Error -->
    <div v-if="apiError" class="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
      {{ apiError }}
    </div>
    
    <!-- VeeValidateの handleSubmit を使用 -->
    <form @submit="handleSubmit" class="space-y-4">
      
      <!-- Email Field -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
        <!-- v-model と v-bind を VeeValidate のものに置き換え -->
        <input 
          id="email"
          type="email" 
          :class="{ 'border-red-500': errors.email }"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
          v-model="email" 
          v-bind="emailAttrs"
          autocomplete="email"
        />
        <!-- VeeValidateのエラーメッセージを表示 -->
        <div v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</div>
      </div>

      <!-- Password Field -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
        <!-- v-model と v-bind を VeeValidate のものに置き換え -->
        <input 
          id="password"
          type="password" 
          :class="{ 'border-red-500': errors.password }"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
          v-model="password" 
          v-bind="passwordAttrs"
          autocomplete="current-password"
        />
        <!-- VeeValidateのエラーメッセージを表示 -->
        <div v-if="errors.password" class="mt-1 text-xs text-red-600">{{ errors.password }}</div>
      </div>
      
      <!-- Submit Button -->
      <div class="pt-2">
        <button 
          type="submit" 
          :disabled="isSubmitting"
          class="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-150 shadow-lg disabled:bg-gray-400"
        >
          {{ isSubmitting ? 'ログイン中...' : 'ログインする' }}
        </button>
      </div>
    </form>

    <!-- Register Link -->
    <div class="mt-4 text-center">
      <NuxtLink to="/register" class="text-sm text-blue-500 hover:text-blue-700 transition duration-150">
        会員登録はこちら
      </NuxtLink>
    </div>
  </div>
</template>