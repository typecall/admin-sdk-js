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

  async uploadToS3(data: Blob | ArrayBuffer, url: string): Promise<void> {
    const response = await fetch(url, {
      method: "PUT",
      body: data,
    });
    if (!response.ok) {
      throw new Error(`S3 Upload failed: ${response.statusText}`);
    }
  }

  async uploadBlob(
    blob: Blob,
    entityId?: string,
    category = "track",
    extension = "wav",
  ): Promise<string> {
    const { url, path } = await this.getUploadLink(
      category,
      entityId,
      extension,
    );
    await this.uploadToS3(blob, url);
    return path;
  }

  async uploadTrack(
    file: { name: string } & Blob,
    entityId?: string,
  ): Promise<{ path: string; name: string }> {
    const extension = file.name.split(".").pop()?.toLowerCase() || "wav";
    const { url, path } = await this.getUploadLink(
      "track",
      entityId,
      extension,
    );
    await this.uploadToS3(file, url);
    return { path, name: file.name };
  }
}
