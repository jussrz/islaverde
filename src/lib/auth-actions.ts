"use server";

import { signIn, signOut } from "@/lib/auth";

export async function signInWithGoogleAction() {
  await signIn("google", { redirectTo: "/post-login" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
