<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useForm } from 'vee-validate'; 
import { registerSchema } from '../schemas/authSchema'; 
import { navigateTo } from '#app'; 

// レイアウトを 'auth' に指定
definePageMeta({
  layout: 'auth',
});

const authStore = useAuthStore();

// --- VeeValidate の導入 ---
const { defineField, handleSubmit: veeValidateHandleSubmit, errors, isSubmitting } = useForm({
  validationSchema: registerSchema, 
  initialValues: {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  },
});

// 各フォームフィールドを定義し、フォームの状態と同期
const [name, nameAttrs] = defineField('name');
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
const [password_confirmation, passwordConfirmationAttrs] = defineField('password_confirmation');


// Laravelのバリデーションエラーを保持する（APIエラー専用）
const apiError = ref(''); 


// --- フォーム送信処理のロジック変更 ---
const handleSubmit = veeValidateHandleSubmit(async (values) => {
  apiError.value = ''; // APIエラーをリセット

  try {
    // 登録アクションを実行。内部でFirebaseユーザー作成とLaravel連携が行われる
    await authStore.register(values);
    
    // 💡 登録処理が成功したら、次のページへリダイレクト
    await navigateTo("/email/verify"); 

  } catch (error: any) {
    if (error.response && error.response.status === 422) {
      // Laravelからのバリデーションエラー
      apiError.value = '入力内容に問題があります。再度ご確認ください。';
    } else if (error.name === "FirebaseTimeoutError") {
      // Firebase初期化タイムアウト
      apiError.value = '認証サービスの準備ができませんでした。再度お試しください。';
    } else if (error.message && error.message.includes("auth/email-already-in-use")) {
      // Firebaseでユーザー作成時に発生するエラー
      apiError.value = 'このメールアドレスは既に使用されています。';
    }
    // 💡 以前成功していたという事実に基づき、その他のエラー（例：Firebase SDKの500エラー）
    // 💡 が出た場合でも、ストアにトークンとユーザーが設定されていればリダイレクトを試みる
    else if (authStore.isAuthenticated) {
        console.warn("Non-critical error detected after successful auth process. Proceeding with redirect.", error);
        await navigateTo("/email/verify"); 
    }
    else {
      // その他、予期せぬエラー
      console.error("Critical registration error:", error);
      apiError.value = '登録処理中に予期せぬエラーが発生しました。時間をおいて再度お試しください。'; 
    }
  }
});

</script>

<template>
  <!-- Register Box: Loginページと同じスタイルを適用 -->
  <div class="w-full max-w-xl p-8 bg-white rounded-lg shadow-xl">
    
    <!-- Title -->
    <h2 class="text-center text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
      会員登録
    </h2>

    <!-- API Error -->
    <!-- 💡 API全体エラーメッセージを表示 -->
    <div v-if="apiError" class="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
      {{ apiError }}
    </div>

    <!-- 💡 VeeValidateの handleSubmit を使用 -->
    <form @submit="handleSubmit" class="space-y-5">
      
      <!-- User Name Field -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">ユーザー名</label>
        <input 
          id="name"
          type="text" 
          :class="{ 'border-red-500': errors.name }"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
          v-model="name"
          v-bind="nameAttrs"
          autocomplete="username"
        />
        <!-- 💡 VeeValidateのエラーメッセージを表示 -->
        <div v-if="errors.name" class="mt-1 text-xs text-red-600">{{ errors.name }}</div>
      </div>
      
      <!-- Email Field -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
        <input 
          id="email"
          type="email" 
          :class="{ 'border-red-500': errors.email }"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
          v-model="email"
          v-bind="emailAttrs"
          autocomplete="email"
        />
        <!-- 💡 VeeValidateのエラーメッセージを表示 -->
        <div v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</div>
      </div>

      <!-- Password Field -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
        <input 
          id="password"
          type="password" 
          :class="{ 'border-red-500': errors.password }"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
          v-model="password" 
          v-bind="passwordAttrs"
          autocomplete="new-password"
        />
        <!-- 💡 VeeValidateのエラーメッセージを表示 -->
        <div v-if="errors.password" class="mt-1 text-xs text-red-600">{{ errors.password }}</div>
      </div>
      
      <!-- Password Confirmation Field -->
      <div>
        <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-1">確認用パスワード</label>
        <input 
          id="password_confirmation"
          type="password" 
          :class="{ 'border-red-500': errors.password_confirmation }"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
          v-model="password_confirmation" 
          v-bind="passwordConfirmationAttrs"
          autocomplete="new-password"
        />
        <!-- 💡 VeeValidateのエラーメッセージを表示 -->
        <div v-if="errors.password_confirmation" class="mt-1 text-xs text-red-600">{{ errors.password_confirmation }}</div>
      </div>
      
      <!-- Submit Button -->
      <div class="pt-2">
        <button 
          type="submit" 
          :disabled="isSubmitting"
          class="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-150 shadow-lg disabled:bg-gray-400"
        >
          {{ isSubmitting ? '登録中...' : '登録する' }}
        </button>
      </div>
    </form>

    <!-- Login Link -->
    <div class="mt-4 text-center">
      <NuxtLink to="/login" class="text-sm text-blue-500 hover:text-blue-700 transition duration-150">
        ログインはこちら
      </NuxtLink>
    </div>
  </div>
</template>