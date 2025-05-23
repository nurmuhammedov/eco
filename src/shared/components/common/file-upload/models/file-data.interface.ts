export interface FileData {
  url: string;
  originalName: string;
  size?: number;
  type?: string;
  blob?: Blob;
  blobUrl?: string;
}
