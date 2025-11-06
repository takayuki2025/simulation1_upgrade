<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'; 
import { useAuthStore } from '@/stores/auth';
import { useRoute, navigateTo, useNuxtApp, useRuntimeConfig } from '#app';
import { storeToRefs } from 'pinia'; 

// 認証が必要なページであることを示すミドルウェアを設定
definePageMeta({
  layout: 'default',
});

// useNuxtApp().$api からカスタムAPIクライアントを取得
const { $api } = useNuxtApp();
if (typeof $api !== 'function') {
  console.error("CRITICAL: $api instance is missing. Check plugins/api-interceptor.ts.");
}

const authStore = useAuthStore();
const { isAuthenticated: isAuthed, token: storeToken } = storeToRefs(authStore); 

const user = ref<any | null>(null);
const form = ref<any>({
  name: '',
  post_number: '',
  address: '',
  building: '',
});

const profileErrors = ref<any>({});
const imageError = ref(''); 
const successMessage = ref('');
const isLoading = ref(true); 

// ユーザー情報取得（初期表示時）
const fetchUserProfile = async () => {
  // ロード済みでユーザーデータがあればスキップ
  if (user.value && !isLoading.value) { 
    return;
  }
  
  isLoading.value = true;
  profileErrors.value = {};
  
  // 認証ストアの解決を待つ (重要な修正点)
  await authStore.waitForAuthResolution(); 

  // 認証状態の確認
  if (!isAuthed.value) { 
      console.log("未認証のためプロフィールページからリダイレクトします。");
      await navigateTo('/login');
      return;
  }
  
  // Sanctumセッションの確立を待つためのワンクッション（維持）
  try {
      console.log("セッション確立確認のためCSRFトークンを強制取得します...");
      await authStore.getSanctumCsrfToken();
      console.log("CSRFトークン取得完了。プロフィール取得へ移行します。");
  } catch(e) {
      console.error("CSRFトークン取得に失敗しました。セッションが切れている可能性があります。", e);
      isLoading.value = false;
      return;
  }
  
  try {
    // credentials: 'include' はグローバルインターセプターで設定済み
    const response = await $api('mypage/profile', {}); 

    if (response && response.user) {
        user.value = response.user; 
        
        form.value.name = response.user.name || '';
        form.value.post_number = response.user.post_number || '';
        form.value.address = response.user.address || '';
        form.value.building = response.user.building || '';
    } else {
        console.warn('APIからユーザーデータが取得できませんでした。');
        user.value = authStore.user; 
    }

    const route = useRoute();
    if (route.query.verified === 'true') {
        successMessage.value = 'メール認証が完了しました！引き続きサービスをご利用いただけます。';
        console.log("メール認証完了。クエリパラメータを削除します。");
        
        await navigateTo({ path: route.path }, { replace: true });
    }

  } catch (error: any) { 
    if (error.response && error.response.status === 401) {
        console.error('プロフィールデータの取得中に401エラー。インターセプターがリダイレクトを処理します。');
        return;
    }
    
    console.error('プロフィールデータの取得に失敗しました:', error);
    successMessage.value = 'プロフィールデータのロードに失敗しました。';
    user.value = authStore.user; 
  } finally {
    isLoading.value = false;
  }
};

// ----------------------------------------------------
// 修正点: onMountedフック内で初期データ取得をトリガーする
// ----------------------------------------------------
onMounted(() => {
    console.log("onMounted: プロフィールデータ取得を開始します。");
    fetchUserProfile();
});


// --- 画像アップロード処理 ---
const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file || !user.value) return; 

  imageError.value = '';
  successMessage.value = '';

  const formData = new FormData();
  formData.append('user_image', file);

  try {
    await authStore.getSanctumCsrfToken(); 

    const response: any = await $api('upload2', { 
      method: 'POST',
      body: formData,
    });

    user.value.user_image = response.image_path; 
    successMessage.value = '画像をアップロードしました。';

  } catch (error: any) {
    console.error('画像アップロードに失敗:', error);
    if (error.response && error.response.status === 422) {
      imageError.value = error.response._data.errors.user_image?.[0] || '無効なファイルです。';
    } else if (error.response && error.response.status === 401) {
      successMessage.value = 'セッションが切れました。再度ログインが必要です。';
      return; 
    } else {
      imageError.value = 'アップロードに失敗しました。';
    }
  }
};

// --- プロフィール情報更新処理 ---
const handleProfileUpdate = async () => {
  profileErrors.value = {};
  successMessage.value = '';
  if (!user.value) return; 

  try {
    await authStore.getSanctumCsrfToken(); 
    
    await $api('profile_update', { 
      method: 'PATCH',
      body: form.value,
    });

    successMessage.value = 'プロフィール情報を更新しました！';
    
    // 成功時、すぐにリダイレクトせずにメッセージを表示するため、navigateToをコメントアウトします
    // await navigateTo('/', { replace: true });

  } catch (error: any) {
    console.error('プロフィール更新に失敗:', error);
    if (error.response && error.response.status === 422) {
      profileErrors.value = error.response._data.errors;
    } else if (error.response && error.response.status === 401) {
      successMessage.value = 'セッションが切れました。再度ログインが必要です。';
      return; 
    } else {
      successMessage.value = '更新に失敗しました。再度お試しください。';
    }
  }
};


// プロフィール画像のURLを生成するヘルパー関数
const getProfileImageUrl = (path: string | undefined | null) => {
  if (!path) {
    return '/storage/images/default-profile2.jpg';
  }
  const base = useRuntimeConfig().public.apiBaseUrl.replace(/\/api$/, '') || ''; 
  
  if (path.startsWith('http')) {
      return path;
  }
  
  return `${base}/${path.replace(/^\//, '')}`; 
};

</script>

<template>
  <div class="login_page">
    <h2 class="title">プロフィール設定</h2>
    
    <!-- ロード中表示 -->
    <div v-if="isLoading && !user" class="text-center p-8">
        <p class="text-lg text-gray-500">データをロード中です...</p>
    </div>

    <!-- ユーザーデータが存在する場合のみ中身を描画するガード -->
    <div v-else-if="user">
      
      <div v-if="successMessage" class="alert-success2">
        {{ successMessage }}
      </div>

      <!-- 画像アップロードフォーム -->
      <form @submit.prevent class="item_sell_contents_box_line">
        <div class="image_name">
          <img 
            :src="getProfileImageUrl(user.user_image)" 
            alt="プロフィール画像" 
            class="user_image_css"
          />
          <button type="button" class="upload_submit" @click="$refs.fileInput.click()">
            画像を選択する
          </button>
          <input 
            type="file" 
            name="user_image" 
            ref="fileInput" 
            style="display: none;" 
            @change="handleImageUpload"
            accept="image/*"
          />
        </div>
        <div class="user_image_error_message">
          {{ imageError }}
        </div>
      </form>

      <!-- プロフィール情報更新フォーム -->
      <form @submit.prevent="handleProfileUpdate">
        <label class="label_form_1">ユーザー名</label>
        <input type="text" class="name_form" name="name" v-model="form.name" />
        <div class="profile__error">
          {{ profileErrors.name ? profileErrors.name[0] : '' }}
        </div>
        
        <label class="label_form_2">郵便番号</label>
        <input type="text" class="email_form" name="post_number" v-model="form.post_number" />
        <div class="profile__error">
          {{ profileErrors.post_number ? profileErrors.post_number[0] : '' }}
        </div>
        
        <label class="label_form_3">住所</label>
        <input type="text" class="password_form" name="address" v-model="form.address" />
        <div class="profile__error">
          {{ profileErrors.address ? profileErrors.address[0] : '' }}
        </div>
        
        <label class="label_form_4">建物名</label>
        <input type="text" class="password_form" name="building" v-model="form.building" />
        <div class="profile__error">
          {{ profileErrors.building ? profileErrors.building[0] : '' }}
        </div>
        
        <div class="submit">
          <input type="submit" class="submit_form" value="更新する" />
        </div>
      </form>
    </div>

    <!-- ユーザーデータが存在しない、かつロードが完了した場合 -->
    <div v-else class="text-center p-8">
        <p class="text-xl text-red-500">ユーザー情報がロードできませんでした。再度ログインしてください。</p>
    </div>
  </div>
</template>

<style scoped>
/* 以前のCSSを維持 */
.login_page {
    text-align: center;
    margin: 0 auto;
    max-width: 1400px;
    padding: 20px;
}
.title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
    color: #4f46e5; 
}
.alert-success2 {
    background-color: #d1fae5; 
    color: #065f46; 
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid #34d399; 
}
.item_sell_contents_box_line {
    border-bottom: 1px solid #e5e7eb; 
    padding-bottom: 1.5rem;
    margin-bottom: 1.5rem;
}
.image_name {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1rem;
}
.user_image_css {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1rem;
    border: 3px solid #6366f1; 
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.upload_submit {
    background-color: #6366f1; 
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.3s;
    font-weight: 600;
}
.upload_submit:hover {
    background-color: #4f46e5; 
}
.user_image_error_message {
    color: #ef4444; 
    margin-top: 0.5rem;
}
.label_form_1, .label_form_2, .label_form_3, .label_form_4 {
    display: block;
    text-align: left;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #374151; 
}
.name_form, .email_form, .password_form {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1.5rem;
    border: 1px solid #d1d5db; 
    border-radius: 0.375rem;
    box-sizing: border-box;
}
.profile__error {
    color: #ef4444; 
    margin-top: -1rem;
    margin-bottom: 1rem;
    text-align: left;
    font-size: 0.875rem;
}
.submit {
    margin-top: 2rem;
}
.submit_form {
    background-color: #6366f1;
    color: white;
    padding: 1rem 2rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1.125rem;
    font-weight: 700;
    transition: background-color 0.3s, transform 0.1s;
    width: 100%;
}
.submit_form:hover {
    background-color: #4f46e5;
}
.submit_form:active {
    transform: scale(0.99);
}
</style>
