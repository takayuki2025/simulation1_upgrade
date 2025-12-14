"use client";

import type { Auth } from "firebase/auth";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

export class FirebaseAuthClient {
  private auth: Auth;

  constructor() {
    if (typeof window === "undefined") {
      throw new Error("FirebaseAuthClient must be used on client only");
    }

    this.auth = getFirebaseAuth();
  }

  async register(email: string, password: string): Promise<User> {
    const result = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password,
    );
    return result.user;
  }

  async login(email: string, password: string): Promise<User> {
    try {
      return (await signInWithEmailAndPassword(this.auth, email, password))
        .user;
    } catch (e) {
      console.error("[Firebase login error]", e);
      throw e;
    }
  }

  async getIdToken(user: User): Promise<string> {
    return user.getIdToken(true);
  }

  // ★ 追加
  async logout(): Promise<void> {
    await signOut(this.auth);
  }
}
