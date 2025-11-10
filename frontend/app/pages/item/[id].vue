<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useItemStore } from '@/stores/item';
import { useAuthStore } from '@/stores/auth';
import { useAuth } from '~/composables/useAuth';

// =======================================================
// ストア・ルータ初期化
// =======================================================
const route = useRoute();
const router = useRouter();
const itemStore = useItemStore();
const authStore = useAuthStore();
const { token: localToken, isAuthenticated } = useAuth(); // localToken はリアクティブ

const itemId = ref<number | null>(null);
const isLoading = ref(true);
const error = ref('');

// ストアから必要なリアクティブな状態を取得
const {
  item,
  isFavorited,
  favoritesCount,
  errors: itemErrors,
  comments
} = storeToRefs(itemStore);
const { user } = storeToRefs(authStore);

const newComment = ref('');
const commentErrors = ref<string[]>([]);


// ★★★ 修正箇所 1: 画像のベースURL設定 (現状の値を維持) ★★★
const IMAGE_BASE_URL = 'https://laravel.test:4430/';
// ★★★ 修正箇所 1 終わり ★★★


// ... (既存の Computed Properties)

const canInteract = computed(() => isAuthenticated.value && user.value?.id !== item.value?.user_id);
const isOwner = computed(() => isAuthenticated.value && user.value?.id === item.value?.user_id);
const isSoldOut = computed(() => (item.value?.remain ?? 0) < 1);
const itemCategories = computed(() => {
  if (!item.value?.category) return [];
  try {
    // categoryプロパティはstoreでstring型に固定されているため、JSON.parseを試みる
    const categories = JSON.parse(item.value.category);
    return Array.isArray(categories) ? categories : [item.value.category];
  } catch (e) {
    // パースに失敗した場合、文字列のまま返す
    return [item.value.category];
  }
});


// ★★★ 修正箇所 2: 完全な画像URLを生成するComputed Propertyを更新（二重結合と画像表示の失敗を同時に解消） ★★★
const fullImageUrl = computed(() => {
  if (!item.value || !item.value.item_image) {
    // 商品情報がない、または画像パスがない場合は、プレースホルダーURLを返す
    return 'https://placehold.co/450x450/D1D5DB/1F2937?text=No+Image';
  }
  let imagePath = item.value.item_image;

  // 1. Pathが既に絶対URLならそのまま返す
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    
    // 💡 念のため、二重結合の原因だった「フルURLの中にベースURLが再び現れる」パターンを検知し修正する
    // これはAPIのデータが病的な場合にのみ必要
    const base = IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL : `${IMAGE_BASE_URL}/`;
    
    // パスの中にベースURLが2回以上含まれていないかチェック
    if (imagePath.includes(base) && imagePath.indexOf(base) !== imagePath.lastIndexOf(base)) {
        // 例: '.../storage/https://laravel.test:4430/storage/...' の場合、2回目のベースURLから切り出す
        const correctedPathIndex = imagePath.lastIndexOf(base);
        return imagePath.substring(correctedPathIndex);
    }
    
    return imagePath;
  }

  // 2. ベースURLを正規化（末尾のスラッシュを必ず持つ）
  const base = IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL : `${IMAGE_BASE_URL}/`;
  
  // 3. imagePathから先頭の `/` や `storage/` などのプレフィックスを全て除去し、クリーンな相対パスを得る
  // 正規表現: パスの先頭にある `/` または `storage/` を全て削除する
  let cleanPath = imagePath.replace(/^(\/|storage\/)+/, '');

  // 4. ベースURL + /storage/ + クリーンなパス を結合
  // これがLaravelの静的ファイルアクセスに期待される最終的な形式
  const finalUrl = `${base}storage/${cleanPath}`;
  
  // 💡 修正後のデバッグログ
  console.log('Computed Full Image URL (Final Normalized V2):', finalUrl);
  
  return finalUrl;
});
// ★★★ 修正箇所 2 終わり ★★★


// =======================================================
// データ取得
// =======================================================
const fetchData = async (id: number) => {
  try {
    isLoading.value = true;
    error.value = '';
    // 1. 認証状態の解決を待つ (Authストアのロジックが完了するのを待つ)
    await authStore.waitForAuthResolution();
    // ★★★ 修正: トークンがセットされるまで待機するロジックをより確実に実装 ★★★
    if (isAuthenticated.value) {
      console.log('User is authenticated. Waiting for token...');
      const maxWait = 2000; // 最大2秒待機
      const interval = 100;
      let waited = 0;

      // localToken が null でなくなるまで、または最大待機時間までループ
      while (!localToken.value && waited < maxWait) {
        await new Promise(resolve => setTimeout(resolve, interval));
        waited += interval;
      }

      if (!localToken.value) {
        // トークンが取得できなかった場合はエラーログを出して続行 (Laravelが false を返す)
        console.warn(`Authentication token could not be loaded within ${maxWait}ms.`);
      }
    }
    // ★★★ 修正終わり ★★★
    // 💡 トークン状態の最終確認ログ (デバッグ用)
    console.log('Token check before API call:', localToken.value ? '✅ Token EXISTS' : '❌ Token MISSING');

    // 2. 商品詳細情報をフェッチ (トークンが null の場合は null が渡される)
    await itemStore.fetchItemDetail(id, localToken.value);
    // itemStoreにエラーが残っていれば、それを表示
    if (itemErrors.value.length > 0) {
      error.value = itemErrors.value[0];
    }

  } catch (e: any) {
    error.value = 'データの取得中にエラーが発生しました。';
  } finally {
    // 💡 最終的な状態をデバッグログに出力
    console.log('--- Final Component State (fetchData end) ---');
    console.log('Is Favorited:', isFavorited.value);
    // 💡 追加デバッグログ: 画像パスの最終確認
    if (item.value) {
        console.log('Original Item Image Path:', item.value.item_image);
        // ★★★ 修正後のデバッグログ: 変換後の完全なURLを出力 ★★★
        console.log('Computed Full Image URL:', fullImageUrl.value);
    }
    isLoading.value = false;
  }
};

// ... (機能ロジック 省略)

const submitFavorite = async () => {
  if (!item.value || !isAuthenticated.value) {
    router.push('/login');
    return;
  }
  await itemStore.toggleFavorite(localToken.value);
  if (itemErrors.value.length > 0) {
    // alertは使用禁止のため、メッセージを一時的に表示するUIなどに置き換えることが推奨されますが、
    // 既存コードに合わせるため、ここでは暫定的に維持します。
    // alert(itemErrors.value[0]);
    console.error("お気に入りエラー:", itemErrors.value[0]);
  }
};

const submitComment = async () => {
  commentErrors.value = [];
  if (!item.value || !isAuthenticated.value) {
    router.push('/login');
    return;
  }
  if (newComment.value.trim() === '') {
    commentErrors.value.push('コメントを入力してください');
    return;
  }
  try {
    // トークンがnullでないことを保証
    await itemStore.postComment(newComment.value, localToken.value!);
    if (itemStore.errors.length > 0) {
      commentErrors.value = itemStore.errors;
    } else {
      newComment.value = '';
    }
  } catch (e: any) {
    commentErrors.value.push('コメント投稿中に予期せぬエラーが発生しました。');
  }
};

const navigateToPurchase = () => {
  if (isOwner.value) {
    router.push('/mypage');
  } else if (isAuthenticated.value && item.value) {
    router.push(`/purchase/${item.value.id}`);
  } else {
    router.push('/login');
  }
};


// =======================================================
// onMounted
// =======================================================
onMounted(async () => {
  const idParam = route.params.id;
  const id = Array.isArray(idParam) ? parseInt(idParam[0]) : parseInt(idParam as string);

  if (isNaN(id)) {
    error.value = '無効な商品IDです。';
    isLoading.value = false;
    return;
  }
  itemId.value = id;
  await fetchData(id);
});
</script>

<template>
<div class="item_detail_wrapper bg-gray-100 min-h-screen">
<div class="item_detail_contents">
<div v-if="isLoading" class="loading-overlay text-center py-20 w-full">
<p class="text-xl font-semibold text-gray-600">商品情報を読み込み中...</p>
</div>

<div v-else-if="error || (itemErrors && itemErrors.length)" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md my-10 w-full max-w-5xl mx-auto">
<p class="font-bold">データの取得エラー</p>
<p v-if="error">{{ error }}</p>
<p v-for="err in itemErrors" :key="err">{{ err }}</p>
</div>

<div v-else-if="item" class="flex flex-wrap lg:flex-nowrap w-full max-w-5xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
<div class="item_detail_image p-4 lg:p-8 w-full lg:w-1/2">
<!-- ★★★ srcは fullImageUrl を使用 ★★★ -->
<img
:src="fullImageUrl"
alt="商品写真"
class="item_detail_image1 w-full h-auto object-cover rounded-lg shadow-md"
onerror="this.onerror=null; this.src='https://placehold.co/450x450/D1D5DB/1F2937?text=No+Image';"
/>
<!-- ★★★ 修正箇所 3 終わり ★★★ -->
</div>

<div class="information p-4 lg:p-8 w-full lg:w-1/2 space-y-4">
<div class="item_detail_name">
<h2 class="text-3xl font-extrabold text-gray-800">{{ item.name }}</h2>
</div>

<div class="item_detail_brand text-sm text-gray-600">
<p class="item_detail_brand_1 font-semibold">ブランド名</p>
<p class="item_detail_brand_2">{{ item.brand || '未登録' }}</p>
</div>

<div class="item_detail_price">
<h2 v-if="isSoldOut" class="text-3xl font-bold text-red-500 bg-red-100 px-3 py-1 rounded inline-block">SOLD OUT</h2>
<h2 v-else class="text-3xl font-bold text-gray-900">
<span class="price_after text-xl font-normal">¥</span>{{ item.price ? item.price.toLocaleString() : '---' }}<span class="price_after text-lg font-normal"> (税込)</span>
</h2>
</div>

<div class="space-y-6 pt-4">
<!-- 💡 修正: アイコンとカウント部分を整理し、Flexboxで間隔を調整 -->
<div class="flex items-center space-x-8">
<!-- お気に入りボタン -->
<div class="flex items-center">
<button
v-if="canInteract"
@click="submitFavorite"
type="button"
class="text-3xl transition-transform transform hover:scale-110 active:scale-90 p-0 m-0 leading-none focus:outline-none"
>
<!-- 💡 ハートアイコンに変更 -->
<span :class="{'text-red-500': isFavorited}" class="heart_icon text-4xl">
{{ isFavorited ? '❤️' : '🤍' }}
</span>
</button>
<span v-else class="text-3xl text-gray-400 leading-none">
🤍
</span>
<p class="text-xl ml-2 font-semibold text-gray-600">{{ favoritesCount }}</p>
</div>

<!-- コメントアイコンとカウント -->
<div class="flex items-center">
<!-- 💡 コメントアイコンを Lucide の SVG アイコン風に変更 -->
<svg
xmlns="http://www.w3.org/2000/svg"
width="32"
height="32"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="1.8"
stroke-linecap="round"
stroke-linejoin="round"
class="text-gray-500"
>
<path d="M21 11.5a8.38 8.38 0 0 1-.6 3.2 12.16 12.16 0 0 1-1.9 2.5c-.8 1.1-1.7 2-2.8 2.5a5.77 5.77 0 0 1-3.6 0c-1.1-.5-2.1-1.4-2.8-2.5a12.16 12.16 0 0 1-1.9-2.5 8.38 8.38 0 0 1-.6-3.2"/>
<path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/>
<path d="M8 10h8"/>
</svg>

<p class="text-xl ml-2 font-semibold text-gray-600">{{ comments ? comments.length : 0 }}</p>
</div>
</div>

<div class="item_detail_form pt-4">
<button
@click="navigateToPurchase"
:disabled="isSoldOut && !isOwner"
:class="{
  'w-full py-3 text-lg font-bold rounded-lg transition duration-200 shadow-lg': true,
  'bg-red-600 text-white hover:bg-red-700 active:bg-red-800': !isSoldOut,
  'bg-gray-400 text-gray-700 cursor-not-allowed': isSoldOut && !isOwner
}"
>
<span v-if="isOwner">マイページへ移動する</span>
<span v-else-if="isAuthenticated && !isSoldOut">購入手続きへ</span>
<span v-else-if="isAuthenticated && isSoldOut">SOLD OUT</span>
<span v-else>ログインして購入</span>
</button>
</div>
</div>

<div class="item_detail_explain mt-8 border-t border-gray-200 pt-6">
<h2 class="text-xl font-bold text-gray-800 mb-2">商品説明</h2>
<h3 class="explain_word text-gray-700 whitespace-pre-wrap">{{ item.explain }}</h3>
</div>
<div class="item_detail_category mt-8 border-t border-gray-200 pt-6">
<div>
<h2 class="text-xl font-bold text-gray-800 mb-2">商品情報</h2>
<div class="flex flex-col space-y-2">
  <div class="flex items-center space-x-4">
    <p class="w-24 text-gray-600 font-medium">カテゴリー</p>
    <ul v-if="itemCategories.length" class="flex flex-wrap gap-2">
      <li v-for="(category, index) in itemCategories" :key="index" class="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
        {{ category }}
      </li>
    </ul>
    <p v-else class="text-gray-500">カテゴリーは登録されていません。</p>
  </div>
</div>
</div>
</div>
<div class="item_detail_condition mt-4">
<div class="flex items-center space-x-4">
  <p class="w-24 text-gray-600 font-medium">商品の状態</p>
  <p class="text-gray-700 font-semibold">{{ item.condition || '未登録' }}</p>
</div>
</div>

<div class="item_detail_comment_history mt-10 border-t border-gray-200 pt-6">
<div class="comment_count_flex flex justify-between items-center mb-4">
<h2 class="text-xl font-bold text-gray-800">コメント</h2>
<span class="comments_count text-gray-500">({{ comments ? comments.length : 0 }})</span>
</div>
<div v-if="comments && comments.length > 0" class="max-h-80 overflow-y-auto pr-2 pt-2 space-y-4">
<div v-for="comment in comments" :key="comment.id" class="comment border-b border-gray-100 pb-3">
<div class="comment_name_image flex items-center space-x-3">
<img
:src="comment.user.user_image || 'https://placehold.co/40x40/D1D5DB/1F2937?text=U'"
alt="プロフィール画像"
class="user_image_css w-10 h-10 rounded-full object-cover"
>
<p class="comment_name font-semibold text-gray-800">{{ comment.user.name }}</p>
</div>
<p class="comment-text ml-10 mt-1 text-gray-700 whitespace-pre-wrap">{{ comment.comment }}</p>
<small class="text-xs ml-10 text-gray-500 block mt-1">投稿日時: {{ new Date(comment.created_at).toLocaleString() }}</small>
</div>
</div>
<p v-else class="mt-4 ml-5 text-gray-500 text-sm">まだコメントはありません。</p>
</div>

<div class="item_detail_comment_form mt-10">
<h2 v-if="isAuthenticated" class="comment_word text-xl font-bold text-gray-800 mb-4">商品へのコメント</h2>
<div v-if="commentErrors.length > 0" class='bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded'>
<ul>
<li v-for="(err, index) in commentErrors" :key="index" class="text-sm">{{ err }}</li>
</ul>
</div>
<form v-if="isAuthenticated" @submit.prevent="submitComment" class="comment_form space-y-3">
<textarea v-model="newComment" rows="5" placeholder="コメントを入力してください" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none text-gray-700"></textarea>
<button type="submit" class="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-200">コメントを送信する</button>
</form>
<div v-else class="text-center p-4 border border-dashed rounded-lg">
<a @click.prevent="router.push('/login')" class="text-red-600 font-semibold cursor-pointer hover:underline">ログインしてコメントする</a>
</div>
</div>
</div>
</div>
</div>
</div>
</template>

<style scoped>
/* Tailwind CSSとの併用を考慮したBladeCSSの再現 */
.item_detail_contents {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
}

.item_detail_image {
    width: 50%;
    max-width: 450px;
    min-width: 300px;
    padding: 50px;
}

.item_detail_image1 {
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    object-position: center;
}

.information {
    width: 50%;
    max-width: 450px;
    min-width: 300px;
    padding: 50px;
}

.item_detail_name h2 {
    max-width: 75%;
    overflow: hidden;
    font-size: 22px;
}

/* BladeのCSSで要素に設定されていたleftやpositionのオフセットをTailwindで上書きするため、ここではリセット/調整をしています。*/
.information h2, .information h3, .information p {
    margin-left: 0 !important; 
    position: static; /* h3, pのleft: 20pxをリセット */
}

.information > div > h2, 
.information > div > div > h2, 
.item_detail_explain h2, 
.item_detail_category h2, 
.item_detail_comment_history h2 {
    font-size: 1.25rem; 
    font-weight: bold; 
}

.item_detail_brand {
    display: flex;
    align-items: center;
    margin-top: 10px;
}
.item_detail_brand_1 {
    font-weight: 700;
    font-size: 14px;
}
.item_detail_brand_2 {
    position: relative; 
    left: 50px; /* Bladeのleft: 50pxを維持 */
    font-weight: 600;
    font-size: 14px;
}

.item_detail_price {
    margin-top: 10px;
    margin-bottom: 20px;
}
.item_detail_price h2 {
    font-size: 26px;
}
.price_after {
    font-size: 19px;
    font-weight: 500;
}

/* 💡 修正後のアイコンコンテナ: Flexboxでシンプルに配置 */
/* .item_detail_icon クラスは削除し、親要素の Tailwind flex space-x-8 を使用 */

/* 💡 お気に入りボタンのカスタムCSSを修正 */
.heart_icon {
    /* ♥️ (黒ハート) は 'filled' の意味で赤色に、♡ (白ハート) は 'unfilled' の意味で灰色に */
    /* text-red-500 クラスで色が変わるように、ここで基本の色を調整 */
    color: currentColor; /* Tailwindクラスによる色指定を許可 */
}

.item_detail_icon {
    display: flex;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 20px;
}
/* 旧CSSを削除/コメントアウト */
/* .favorite_button, .star_text, .ster_icon_1, .ster_icon_2, .favorites_count, .comments_icon, .comments_count0 は削除または調整 */


.explain_word {
    word-break: break-all;
    overflow-wrap: break-word;
    font-weight: 600;
    white-space: pre-wrap;
    word-wrap: break-word;
    line-height: 1.6;
    margin-left: 20px; /* h3のleft: 20pxをmarginで代替 */
    font-size: 14px;
}

.category_views {
    display: flex;
    flex-wrap: wrap;
    padding-left: 0; 
    margin-top: 10px;
}
.category_mark01 {
    position: relative;
    right: 22px; /* category_mark01のright: 22pxを維持 */
    font-weight: 700;
    list-style: none;
}
.category_mark {
    position: relative;
    left: 20px; /* category_markのleft: 20pxを維持 */
    margin-right: 10px;
    list-style: none;
    background-color: #d9d9d9;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 70px;
    height: 20px;
    padding: 2px 5px;
}

.item_detail_condition {
    display: flex;
    align-items: center;
}
.item_detail_condition_1 {
    font-size: 16px;
    font-weight: 700;
}
.item_detail_condition_2 {
    position: relative;
    left: 50px; /* item_detail_condition_2のleft: 50pxを維持 */
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
}

.info_submit, .comment_submit {
    width: 350px;
    height: 30px;
    font-weight: bold;
    font-size: 17px;
    display: block;
    color: aliceblue;
    border: #ff5555;
    background-color: #ff5555;
    text-decoration: none;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
    border-radius: 0;
    border-width: 0; /* Tailwindでborderが適用されるのを避ける */
}
.comment_submit {
    margin-top: 15px;
    font-weight: 800;
}

.comment_count_flex {
    display: flex;
    align-items: center;
    color: #5f5f5f;
}
.comments_count {
    position: relative;
    top: 0;
    margin-left: 10px;
    font-size: 14px;
    font-weight: normal;
}
.comment {
    max-width: 320px;
    word-break: break-all;
    overflow-wrap: break-word;
    margin-top: 15px;
    padding-top: 10px;
    border-top: 1px dashed #ccc;
}
.comment-text {
    font-weight: 600;
    white-space: pre-wrap;
    word-wrap: break-word;
    line-height: 1.6;
    margin-left: 50px;
    font-size: 14px;
}
.comment_name_image {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}
.user_image_css {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    object-fit: cover;
    object-position: center;
    position: relative;
    left: 0px; 
}
.comment_name {
    position: relative;
    left: 10px; 
    font-size: 17px;
    font-weight: 700;
}
.item_detail_comment_form h2 {
    font-size: 18px;
    position: relative;
    top: 8px;
    margin-bottom: 10px;
}
textarea {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.error_massage {
    color: red;
    list-style-type: none;
    padding-left: 0;
    margin-top: 10px;
}

@media (max-width: 768px) {
    .item_detail_image,
    .information {
        width: 100%;
        max-width: 100%;
        min-width: unset;
        padding: 20px;
    }

    .info_submit, .comment_submit {
        width: 100%;
        max-width: 450px;
    }
}
</style>