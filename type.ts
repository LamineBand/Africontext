export interface ContextAuthor {
  _id: string;
  nom: string;
  email: string;
}

export type Status = "pending" | "approved" | "revision" | "rejected";

export interface Context {
  _id: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  content_payload: string;
  service: string;
  pays: string[];
  version_api: string;
  source_url: string;
  tested_with: string[];
  status: Status;
  author_id: ContextAuthor;
  last_verified_at: string;
  created_at: string;
  __v: number;
}

export interface ContextResponse {
  message: string;
  contexts: Context[];
}
