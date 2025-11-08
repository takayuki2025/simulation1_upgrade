<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRoute, navigateTo, useNuxtApp, useRuntimeConfig } from '#app';
import { storeToRefs } from 'pinia';
import { useApi } from '~/composables/useApi';

// 認証が必要なページであることを示すミドルウェアを設定 (今回は設定済み)
definePageMeta({
  layout: 'default',
});

const { $api } = useNuxtApp();
if (typeof $api !== 'function') {
  console.error("CRITICAL: $api instance is missing. Check plugins/api-interceptor.ts.");
}

const authStore = useAuthStore();
const { isAuthenticated: isAuthed, user: authUser } = storeToRefs(authStore); // authUserをストアから直接取得
const { authenticatedFetch } = useApi(); // useApi composableを呼び出し

// User interface, assuming it matches the backend model
interface User {
  id: number;
  name: string;
  email: string;
  uid: string;
  email_verified_at: string | null;
  post_number: string | null; 
  address: string | null;      
  building: string | null;     
  user_image?: string | null;
}

const user = ref<User | null>(null);
const form = ref<any>({
  name: '',
  post_number: '',
  address: '',
  building: '',
});

const profileErrors = ref<any>({});
const imageError = ref('');
const successMessage = ref('');
const isLoading = ref(true); // CSRのため、ローディング状態を別途管理
const route = useRoute();

/**
 * APIから取得したユーザーデータ、またはPiniaストアのデータで
 * フォームと状態を初期化する
 * @param apiData APIから取得した生データ (null/undefinedの可能性あり)
 */
const initializeUserData = (apiData: any) => {
    let sourceData: User | null = null;
    
    // 1. API応答に完全なユーザーデータがあるか確認
    if (apiData && apiData.user) {
        sourceData = apiData.user as User; 
        console.log("【Init】API応答の完全なデータで初期化しました。");
    } 
    // 2. API応答がユーザーオブジェクトそのものの形式であった場合
    else if (apiData && apiData.id && apiData.name) {
        sourceData = apiData as User;
        console.log("【Init】API応答のユーザーオブジェクトで初期化しました。");
    }
    
    // 3. APIデータが利用できない、またはデータ不足の場合、Piniaストアのデータで補完/フォールバック
    if (!sourceData && authStore.user) {
        sourceData = authStore.user as User;
        console.log("【Init】APIデータ不足。Piniaストアの認証データで初期化しました。");
    }
    
    // 状態とフォームに反映
    user.value = sourceData;
    
    if (user.value) {
        // フォームへの値の代入ロジック（データがnullでも空文字列で安全に初期化）
        form.value.name = user.value.name || '';
        form.value.post_number = user.value.post_number || '';
        form.value.address = user.value.address || '';
        form.value.building = user.value.building || '';
    } else {
        // 最終的にデータが取得できなかった場合
        console.error("【Init】ユーザー情報を特定できませんでした。");
    }
};

/**
 * クライアントサイドでのプロフィールデータ取得ロジック (CSR専用)
 */
const fetchUserProfile = async () => {
    isLoading.value = true;
    
    await authStore.waitForAuthResolution();

    if (!isAuthed.value) {
        console.log("未認証のためログインへリダイレクトします。");
        await navigateTo('/login');
        isLoading.value = false;
        return;
    }
    
    // Piniaストアの基本データで一旦初期化（APIコール失敗時のフォールバックを確保）
    // NOTE: authStore.user は storeToRefs で authUser になっているが、ここでは直接アクセス
    initializeUserData(authStore.user); 

    try {
        // ベースURLに対する絶対パスとして強制
        const response = await authenticatedFetch('/mypage/profile', {}); 
        
        // APIからの応答でデータを更新
        initializeUserData(response);
        
        // メール認証後のクエリパラメータ処理
        if (user.value && route.query.verified === 'true') {
            successMessage.value = 'メール認証が完了しました！引き続きサービスをご利用いただけます。';
            console.log("メール認証完了。クエリパラメータを削除します。");
            
            // クエリパラメータを削除してURLをクリーンにする
            navigateTo({ path: route.path }, { replace: true });
        }
        
    } catch (err: any) {
        console.error('プロフィールデータのロードに失敗しました:', err);
        // 401はauthenticatedFetch側で処理されるため、ここでは警告表示のみ
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchUserProfile();
});


// ----------------------------------------------------------------
// --- 2. 画像アップロード処理 (ストア更新のヘルパーメソッドがないため、ここで直接APIとストアを更新) ---

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file || !user.value) return;

  imageError.value = '';
  successMessage.value = '';
  isLoading.value = true;

  console.log('【DEBUG】画像アップロード処理を開始します。'); 
  
  const formData = new FormData();
  formData.append('user_image', file);

  try {
    const response: any = await authenticatedFetch('/upload2', { 
      method: 'POST', 
      body: formData,
      headers: {
        'Accept': 'application/json',
      }
    });

    console.log('【DEBUG】画像アップロードAPIコールが成功しました。', response); 

    // ユーザーオブジェクトのuser_imageパスを更新
    const imagePath = response.image_path || response.user_image;
    if (imagePath) {
        user.value!.user_image = imagePath; 
        
        // --- ★ 修正ポイント: authStore.user を直接更新 (auth.tsで setAuthUser がないため) ★ ---
        // Piniaストアの user オブジェクトを直接更新します
        if (authStore.user) {
            authStore.user.user_image = imagePath;
        }
    }
    
    successMessage.value = '画像をアップロードしました。';


  } catch (error: any) {
    console.error('【ERROR】画像アップロードに失敗しました:', error); 
    if (error.status === 401) {
        successMessage.value = 'セッションが切れました。再度ログインが必要です。';
        return;
    }
    
    if (error.response && error.response.status === 422) {
      imageError.value = error.response._data.errors.user_image?.[0] || '無効なファイルです。';
    } else {
      imageError.value = `アップロードに失敗しました (ステータス: ${error.status || '不明'})。`;
    }
  } finally {
    isLoading.value = false;
  }
};

// ----------------------------------------------------------------
// --- 3. プロフィール情報更新処理 (ストアのアクションを利用) ---

const handleProfileUpdate = async () => {
  profileErrors.value = {};
  successMessage.value = '';
  if (!user.value) return;
  isLoading.value = true;
  
  console.log('【DEBUG】プロフィール更新処理を開始します。');
  console.log('【DEBUG】送信データ (form.value):', form.value);
  
  try {
    // --- ★ 修正ポイント: APIコールとストア更新を authStore.updateUserProfile に一任する ★ ---
    // form.value は ProfileUpdateForm の型定義を満たしています
    const updatedUser = await authStore.updateUserProfile(form.value); 
    
    // --- 成功時 ---
    console.log('【DEBUG】プロフィール更新APIコールが成功しました。Piniaストアも更新されました。');

    successMessage.value = 'プロフィール情報を更新しました！';
    
    // Piniaストアで更新された最新のデータでローカルの user と form を同期
    user.value = updatedUser;
    
    // フォームも最新の情報で再初期化
    if (user.value) {
        form.value.name = user.value.name || '';
        form.value.post_number = user.value.post_number || '';
        form.value.address = user.value.address || '';
        form.value.building = user.value.building || '';
    }

  } catch (error: any) {
    // --- エラー時 ---
    const statusCode = error.status || (error.response ? error.response.status : '不明');
    console.error(`【ERROR】プロフィール更新に失敗しました (ステータス: ${statusCode})。`, error); 
    
    if (error.status === 401) {
        successMessage.value = 'セッションが切れました。再度ログインが必要です。';
        return;
    }
    
    // Piniaアクション内で throw されたエラーの処理
    if (error.response && error.response.status === 422) {
      // バリデーションエラー
      profileErrors.value = error.response._data.errors;
    } else {
      successMessage.value = `更新に失敗しました。(Status: ${statusCode}) 再度お試しください。`;
    }
  } finally {
    isLoading.value = false;
  }
};

// ----------------------------------------------------------------
// --- 4. ヘルパー関数 ---

// プロフィール画像のURLを生成するヘルパー関数
const getProfileImageUrl = (path: string | undefined | null) => {

  const config = useRuntimeConfig().public;
  let base = config.apiBaseUrl;

  // /apiで終わっている場合は、それを削除してLaravelのルートURLにする
  if (base.endsWith('/api')) {
    base = base.substring(0, base.length - 4);
  }

  // デフォルト画像パス (Laravelの storage/images/default-profile2.jpg へのパス)
  const DEFAULT_IMAGE_PATH = 'storage/images/default-profile2.jpg';
  const DEFAULT_IMAGE_FULL_URL = `${base}/${DEFAULT_IMAGE_PATH}`; 

  if (!path) {
    return DEFAULT_IMAGE_FULL_URL;
  }

  // URLがフルパスの場合はそのまま返す
  if (path.startsWith('http')) {
    return path;
  }

  // データベースにパスが保存されている場合（例: storage/user_images/abc.jpg）
  return `${base}/${path.replace(/^\//, '')}`; 
};

</script>

<template>
<!-- Tailwindで基本のコンテナ設定を適用 -->
<div class="login_page max-w-[1400px] mx-auto pt-5 pb-10">
<h2 class="title">プロフィール設定</h2>

<!-- ロード中表示 -->
<div v-if="isLoading && !user" class="text-center p-8">
    <!-- userが存在しない状態での初期ロード中のみ表示 -->
    <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500 mx-auto"></div>
    <p class="text-lg text-gray-500 mt-3">データをロード中です...</p>
</div>

<!-- ユーザーデータが存在する場合のみ中身を描画するガード -->
<div v-else-if="user" class="form-wrapper">
  
  <!-- 成功メッセージの表示 (元のCSSでは .alert-success2) -->
  <div v-if="successMessage" class="alert-success2">
    {{ successMessage }}
  </div>

  <!-- 画像アップロードフォーム -->
  <form @submit.prevent class="item_sell_contents_box_line">
    <div class="image_name">
      <!-- 画像とボタンを横並びにするラッパーを追加 -->
      <div class="image_button_row">
        <!-- imgタグは user_image_css クラスでScoped CSSの制御下にある -->
        <img 
          :src="getProfileImageUrl(user.user_image)" 
          alt="プロフィール画像" 
          class="user_image_css"
        />
        <!-- ボタンは upload_submit クラスでScoped CSSの制御下にある -->
        <button 
          type="button" 
          class="upload_submit" 
          @click="$refs.fileInput.click()"
          :disabled="isLoading"
        >
          画像を選択する
        </button>
      </div>
      <!-- Bladeのscriptタグで実現されていた自動送信は、Vueの @change イベントで実現 -->
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
    
    <!-- ユーザー名 -->
    <div class="form-group">
        <label class="label_form_1">ユーザー名</label>
        <input type="text" class="name_form" name="name" v-model="form.name" />
        <div class="profile__error">
          {{ profileErrors.name ? profileErrors.name[0] : '' }}
        </div>
    </div>
    
    <!-- 郵便番号 -->
    <div class="form-group">
        <label class="label_form_2">郵便番号 (7桁、ハイフンなし)</label>
        <input 
          type="text" 
          class="email_form" 
          name="post_number" 
          v-model="form.post_number" 
          placeholder="例: 1000001" 
          maxlength="8"
        />
        <div class="profile__error">
          {{ profileErrors.post_number ? profileErrors.post_number[0] : '' }}
        </div>
    </div>
    
    <!-- 住所 -->
    <div class="form-group">
        <label class="label_form_3">住所</label>
        <input type="text" class="password_form" name="address" v-model="form.address" placeholder="手動で入力してください" />
        <div class="profile__error">
          {{ profileErrors.address ? profileErrors.address[0] : '' }}
        </div>
    </div>
    
    <!-- 建物名 -->
    <div class="form-group">
        <label class="label_form_4">建物名</label>
        <input type="text" class="password_form" name="building" v-model="form.building" />
        <div class="profile__error">
          {{ profileErrors.building ? profileErrors.building[0] : '' }}
        </div>
    </div>
    
    <div class="submit">
      <input type="submit" class="submit_form" value="更新する" :disabled="isLoading" />
    </div>
  </form>
</div>

<!-- ユーザーデータが存在しない、かつロードが完了した場合 -->
<div v-else class="text-center p-8">
    <p v-if="!isAuthed.value" class="text-xl text-red-500">認証されていません。ログインページへ移動しています...</p>
    <p v-else class="text-xl text-red-500">ユーザー情報がロードできませんでした。再度お試しください。</p>
</div>


</div>
</template>

<style scoped>
/*
|--------------------------------------------------------------------------
| スコープ付きCSS (元のCSSの99%再現を目指す)
|--------------------------------------------------------------------------
*/

/* -------------------- 共通コンテナ -------------------- */
.login_page {
text-align: center;
}

.title {
font-size: 2rem;
font-weight: bold;
margin-bottom: 2rem;
color: #4f46e5;
}

.form-wrapper {
display: inline-block;
text-align: center;
}

/* -------------------- メッセージ・エラー -------------------- */
.alert-success2 {
background-color: #d1fae5;
color: #065f46;
padding: 1rem;
border-radius: 0.5rem;
margin-bottom: 1.5rem;
border: 1px solid #34d399;
}


.profile__error, .user_image_error_message {
color: #ff5555;
font-size: 15px;
text-align: left;
margin-top: -5px;
margin-bottom: 5px;
padding-left: 5px;
width: 400px;
margin-left: auto;
margin-right: auto;
}

.user_image_error_message {
text-align: center;
position: relative;
bottom: 20px;
}

/* -------------------- 画像アップロード (横並び調整) -------------------- */

.item_sell_contents_box_line {
display: block;
padding-bottom: 0;
margin-bottom: 0;
}

.image_name {
display: flex;
justify-content: center;
align-items: center;
padding-top: 35px;
padding-bottom: 60px;
position: relative;
}

/* 横並びを実現する新しいラッパー */
.image_button_row {
display: flex;
align-items: center;
gap: 30px;

position: relative;
right: 50px; 


}

.user_image_css {
width: 100px;
height: 100px;
border-radius: 50%;
overflow: hidden;
object-fit: cover;
object-position: center;
position: static;
}

.upload_submit {
position: static;
margin: 0;

color: #ff5555;
font-weight: 700;
background-color: white;
border: 1px solid #ff5555;
border-radius: 5px;
padding: 5px 10px;
cursor: pointer;
white-space: nowrap;


}

/* -------------------- フォーム要素 -------------------- */

.form-group {
width: 400px;
margin: 0 auto;
text-align: center;
}

.label_form_1, .label_form_2, .label_form_3, .label_form_4 {
font-weight: 700;
display: block;
text-align: left;
position: relative;
left: 0;
}

.label_form_2 { margin-top: 30px; }
.label_form_3 { margin-top: 30px; }
.label_form_4 { margin-top: 30px; }

.name_form, .email_form, .password_form {
width: 400px;
height: 30px;
box-sizing: border-box;
padding: 0 10px;
margin-bottom: 10px; /* profile__errorとのスペースを確保するため調整 */
border: 1px solid #d1d5db;
border-radius: 3px;
}

/* -------------------- 送信ボタン -------------------- */
.submit {
margin-top: 10px;
display: block;
}

.submit_form {
position: relative;
top: 20px;
width: 400px;
height: 40px; /* 高さを少し大きくして押しやすく */
margin: 30px auto;
background-color: #ff5555;
border: #ff5555;
color: white;
font-weight: 700;
cursor: pointer;
border-radius: 5px;
transition: background-color 0.1s;
}

.submit_form:hover {
background-color: #e54c4c;
}
.submit_form:disabled {
background-color: #9ca3af;
cursor: not-allowed;
}
</style>