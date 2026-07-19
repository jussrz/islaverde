import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const GALLERY_BUCKET = "gallery";

// Server-only: uses the service role key to bypass Storage RLS, since
// uploads are only ever initiated from admin-only server actions/routes.
// Lazily constructed so importing this module never fails at build/import
// time — only an actual upload/delete call requires the env vars to be set.
let cachedClient: SupabaseClient | null = null;

function getSupabaseAdmin() {
  if (cachedClient) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set to upload images");
  }

  cachedClient = createClient(url, key);
  return cachedClient;
}

export async function uploadGalleryImage(file: File) {
  const supabaseAdmin = getSupabaseAdmin();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${randomUUID()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(GALLERY_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(GALLERY_BUCKET).getPublicUrl(path);

  return { url: publicUrl, path };
}

export async function deleteGalleryImage(path: string) {
  const supabaseAdmin = getSupabaseAdmin();
  const { error } = await supabaseAdmin.storage.from(GALLERY_BUCKET).remove([path]);
  if (error) {
    throw new Error(`Image delete failed: ${error.message}`);
  }
}
