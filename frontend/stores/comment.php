import { defineStore } from "pinia";
// 💡 必要な型定義は適宜追加

export interface Comment {
  id: number;
  user: { name: string; user_image: string };
  comment: string;
  created_at: string;
}

interface CommentState {
  comments: Comment[];
  errors: string[];
}

export const useCommentStore = defineStore("comment", {
  state: (): CommentState => ({
    comments: [],
    errors: [],
  }),
  actions: {
    async fetchComments(itemId: number) {
      this.errors = [];
      // 💡 APIからコメントを取得する実際のロジック
      try {
        // const response = await fetch(`/api/items/${itemId}/comments`);
        // this.comments = await response.json();

        // 仮のダミーデータ
        this.comments = [
          // ... コメントデータ ...
        ];
      } catch (error) {
        this.errors.push("コメントの取得に失敗しました。");
      }
    },
    async postComment(itemId: number, comment: string, token: string) {
      this.errors = [];
      // 💡 APIにコメントを投稿する実際のロジック
      try {
        // const response = await fetch(`/api/comments`, {
        //     method: 'POST',
        //     headers: { 'Authorization': `Bearer ${token}` },
        //     body: JSON.stringify({ item_id: itemId, comment: comment })
        // });

        // 成功したらコメント一覧を再取得
        await this.fetchComments(itemId);
      } catch (error) {
        this.errors.push("コメントの投稿に失敗しました。");
      }
    },
  },
});
