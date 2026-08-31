const FILENAME_STAR_PATTERN = /filename\*=(?:UTF-8'')?([^;]+)/i;
const FILENAME_PATTERN = /filename="?([^";]+)"?/i;

/**
 * Pulls the download filename out of a `Content-Disposition` response header so
 * the browser saves the file under the name the API chose.
 */
export const parseFilenameFromContentDisposition = (
  contentDisposition: string | undefined | null,
  fallback: string,
): string => {
  if (!contentDisposition) return fallback;

  const starMatch = contentDisposition.match(FILENAME_STAR_PATTERN);
  if (starMatch?.[1]) {
    try {
      return decodeURIComponent(starMatch[1].trim().replace(/"/g, ''));
    } catch {
      // Fall through to the plain `filename=` form below.
    }
  }

  const match = contentDisposition.match(FILENAME_PATTERN);
  return match?.[1]?.trim() || fallback;
};

/**
 * Triggers a browser download for an in-memory payload.
 */
export const downloadBlob = (data: BlobPart, filename: string, type: string): void => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  window.URL.revokeObjectURL(url);
  link.remove();
};
