<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth'; // Authストアを使用

// 認証が必要なページであることを示すミドルウェアを設定
definePageMeta({
  // middleware: 'auth', // 必要に応じてコメントアウトを解除
  layout: 'default',
});

// グローバルな $fetch を使用
const fetcher = globalThis.$fetch;
const authStore = useAuthStore();

// ユーザー情報とフォームの状態を null で初期化（データがまだない状態を表現）
const user = ref<any | null>(null);
const form = ref<any>({
  name: '',
  post_number: '',
  address: '',
  building: '',
});

// エラーと成功メッセージ
const profileErrors = ref<any>({});
const imageError = ref(''); 
const successMessage = ref('');
const isLoading = ref(true); // ロード状態

// ユーザー情報取得（初期表示時）
const fetchUserProfile = async () => {
  isLoading.value = true;
  profileErrors.value = {};
  
  // 認証が解決するのを待機（デッドロック回避プラグインと連携）
  await authStore.waitForAuthResolved();

  if (!authStore.isAuthenticated) {
      // 未認証ならログインページへリダイレクト（ミドルウェアがない場合のガード）
      console.log("未認証のためプロフィールページからリダイレクトします。");
      await navigateTo('/login');
      return;
  }
  
  try {
    // 【APIエンドポイントの確認と修正: /api/mypage/profile を使用】
    const response = await fetcher('/api/mypage/profile', {
        baseURL: authStore.getApiBaseUrl(), // PiniaストアからベースURLを取得
        credentials: 'include',
        headers: { Accept: 'application/json' },
    }); 

    // レスポンスをチェックし、userオブジェクトが存在するか確認する
    if (response && response.user) {
        user.value = response.user; // ユーザーオブジェクトをセット
        
        // フォームに初期値を安全にセット
        form.value.name = response.user.name || '';
        form.value.post_number = response.user.post_number || '';
        form.value.address = response.user.address || '';
        form.value.building = response.user.building || '';
    } else {
        console.warn('APIからユーザーデータが取得できませんでした。');
        user.value = authStore.user; // 少なくともPiniaのデータを表示
    }

    // メール認証完了後のリダイレクトによるメッセージを処理
    const route = useRoute();
    if (route.query.verified === 'true') {
        successMessage.value = 'メール認証が完了しました！';
        // URLからクエリパラメータを削除してURLをクリーンにする
        navigateTo({ path: route.path }, { replace: true });
    }

  } catch (error) {
    console.error('プロフィールデータの取得に失敗しました:', error);
    successMessage.value = 'プロフィールデータのロードに失敗しました。';
    user.value = authStore.user; // エラー時もPiniaのデータがあればそれを使用
  } finally {
    isLoading.value = false;
  }
};

// --- 画像アップロード処理 ---
const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file || !user.value) return; // userがnullの場合は処理しないガードを追加

  imageError.value = '';
  successMessage.value = '';

  const formData = new FormData();
  formData.append('user_image', file);

  try {
    // POST /api/upload2 を叩く
    const response: any = await fetcher('/api/upload2', { 
      baseURL: authStore.getApiBaseUrl(),
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    // 成功したら新しい画像パスをユーザーオブジェクトに反映
    user.value.user_image = response.image_path; 
    successMessage.value = '画像をアップロードしました。';

  } catch (error: any) {
    console.error('画像アップロードに失敗:', error);
    if (error.response && error.response.status === 422) {
      imageError.value = error.response._data.errors.user_image?.[0] || '無効なファイルです。';
    } else {
      imageError.value = 'アップロードに失敗しました。';
    }
  }
};

// --- プロフィール情報更新処理 ---
const handleProfileUpdate = async () => {
  profileErrors.value = {};
  successMessage.value = '';
  if (!user.value) return; // userがnullの場合は処理しないガード

  try {
    // PATCH /api/profile_update を叩く
    await fetcher('/api/profile_update', { 
      baseURL: authStore.getApiBaseUrl(),
      method: 'PATCH',
      body: form.value,
      credentials: 'include',
    });

    successMessage.value = 'プロフィール情報を更新しました！';
    
    // 成功したらルートページ ('/') に遷移する
    await navigateTo('/', { replace: true });

  } catch (error: any) {
    console.error('プロフィール更新に失敗:', error);
    if (error.response && error.response.status === 422) {
      // Laravelのバリデーションエラーをセット
      profileErrors.value = error.response._data.errors;
    } else {
      successMessage.value = '更新に失敗しました。再度お試しください。';
    }
  }
};

onMounted(fetchUserProfile);

// プロフィール画像のURLを生成するヘルパー関数
const getProfileImageUrl = (path: string | undefined | null) => {
  // pathが undefined, null, 空文字列の場合はデフォルト画像
  if (!path) {
    return '/storage/images/default-profile2.jpg';
  }
  // APIのベースURLを使用してフルパスを構成
  const base = useRuntimeConfig().public.apiBaseUrl.replace(/\/api$/, '') || ''; 
  // ★ ここでベースURLと画像パスを結合する際のパス区切り文字に注意 (例: http://example.com/storage/path/...)
  return `${base}/${path}`; 
};

</script>

<template>
  <div class="login_page">
    <h2 class="title">プロフィール設定</h2>
    
    <!-- ロード中表示 -->
    <div v-if="isLoading" class="text-center p-8">
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
          <!-- user が存在するため、user.user_image の参照は安全 -->
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
        <!-- form.name の v-model 参照は安全 -->
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
}
.title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
    color: #4f46e5; /* Tailwind indigo-600相当 */
}
.alert-success2 {
    background-color: #d1fae5; /* Tailwind green-100 */
    color: #065f46; /* Tailwind green-900 */
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid #34d399; /* Tailwind green-400 */
}
.item_sell_contents_box_line {
    border-bottom: 1px solid #e5e7eb; /* Tailwind gray-200 */
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
    border: 3px solid #6366f1; /* Tailwind indigo-500 */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.upload_submit {
    background-color: #6366f1; /* Tailwind indigo-500 */
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.3s;
    font-weight: 600;
}
.upload_submit:hover {
    background-color: #4f46e5; /* Tailwind indigo-600 */
}
.user_image_error_message {
    color: #ef4444; /* Tailwind red-500 */
    margin-top: 0.5rem;
}
.label_form_1, .label_form_2, .label_form_3, .label_form_4 {
    display: block;
    text-align: left;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #374151; /* Tailwind gray-700 */
}
.name_form, .email_form, .password_form {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1.5rem;
    border: 1px solid #d1d5db; /* Tailwind gray-300 */
    border-radius: 0.375rem;
    box-sizing: border-box;
}
.profile__error {
    color: #ef4444; /* Tailwind red-500 */
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