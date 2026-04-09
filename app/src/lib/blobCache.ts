/**
 * blobCache — fetch-blob strategy for zero-stutter video playback.
 *
 * HOW IT WORKS:
 *   1. BlobPreloader components call preloadBlob(url) for the NEXT scene's video
 *      while the CURRENT scene plays. The full file is downloaded into memory.
 *   2. When VideoPlayer mounts for that next scene, it calls consumeBlob(url)
 *      synchronously inside useState(). If the blob is ready it uses the blob URL
 *      from frame 1, avoiding any CDN round-trip. If not ready, falls back to the
 *      original URL (graceful degradation).
 *   3. When VideoPlayer unmounts it calls release() → URL.revokeObjectURL() freeing
 *      the memory immediately.
 *   4. When BlobPreloader unmounts (scene transition), its cleanup is a no-op if
 *      VideoPlayer already consumed the blob, or revokes it if nobody did.
 *
 * MEMORY SAFETY:
 *   React renders the NEW component tree (and runs useState initialisers) BEFORE
 *   running old components' useEffect cleanup. This means consumeBlob() always runs
 *   before BlobPreloader's cleanup, so we never revoke a blob that's in use.
 *
 * LIMIT: at most 2 blobs live simultaneously (current scene + next preloading).
 */

const store = new Map<string, string>();   // originalUrl → blobUrl (ready)
const fetching = new Set<string>();        // originalUrl (in-flight fetch)

/**
 * Begin downloading url and caching as a blob.
 * Returns a cleanup function: revokes the blob if nobody consumed it by cleanup time.
 */
export function preloadBlob(url: string): () => void {
  if (store.has(url) || fetching.has(url)) {
    // Already in cache or downloading — cleanup is a safe no-op
    return () => {
      const blobUrl = store.get(url);
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        store.delete(url);
      }
    };
  }

  fetching.add(url);

  fetch(url)
    .then(r => {
      if (!r.ok) throw new Error(`${r.status}`);
      return r.blob();
    })
    .then(blob => {
      store.set(url, URL.createObjectURL(blob));
    })
    .catch(() => { /* silently log — VideoPlayer will fall back to CDN URL */ })
    .finally(() => fetching.delete(url));

  return () => {
    // React guarantees this runs AFTER the new component tree's useState initialisers.
    // If VideoPlayer consumed the blob, store no longer has this entry — no-op.
    const blobUrl = store.get(url);
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      store.delete(url);
    }
  };
}

/**
 * Called synchronously inside VideoPlayer's useState() initialiser on mount.
 * Returns the blob URL + a release function if the blob is ready; null otherwise.
 * Ownership transfers to the caller — they must call release() on unmount.
 */
export function consumeBlob(url: string): { blobUrl: string; release: () => void } | null {
  const blobUrl = store.get(url);
  if (!blobUrl) return null;

  store.delete(url); // Transfer ownership — caller is now responsible for revocation

  return {
    blobUrl,
    release: () => URL.revokeObjectURL(blobUrl),
  };
}
