// Remembers the uploaded file per photo, so a retry after a failed row save does not upload it twice
export type UploadMemo = { url?: string }

export async function uploadGalleryPhoto(
  memo: UploadMemo,
  steps: { uploadFile: () => Promise<string>; addRow: (url: string) => Promise<void> }
): Promise<void> {
  if (!memo.url) memo.url = await steps.uploadFile()
  await steps.addRow(memo.url)
}
