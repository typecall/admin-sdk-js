import type { TagScope } from "../../../domains/workspace/tag.js";

export interface CreateTagRequest {
  name: string;
  color: string;
  scopes: TagScope[];
}

export interface UpdateTagRequest {
  name?: string;
  color?: string;
  scopes?: TagScope[];
}
