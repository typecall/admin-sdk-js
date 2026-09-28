import type { FileDownloadLink, FileUploadLink } from "../dto/file.js";
import { BaseResourceClient } from "./base.js";

export class FilesClient extends BaseResourceClient {
  getDownloadLink(path: string): Promise<FileDownloadLink> {
    return this.transport.requestData<FileDownloadLink>(
      "/files/link/download",
      {
        headers: { "X-File-Path": path },
      },
    );
  }

  getUploadLink(
    category: string,
    entityId?: string,
    extension?: string,
  ): Promise<FileUploadLink> {
    const params = new URLSearchParams({ category });
    if (entityId) params.append("entity_id", entityId);
    if (extension) params.append("extension", extension);
    return this.transport.requestData<FileUploadLink>(
      `/files/link/upload?${params.toString()}`,
    );
  }
}
