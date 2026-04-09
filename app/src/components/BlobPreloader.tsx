import { useEffect } from 'react';
import { preloadBlob } from '../lib/blobCache';

interface BlobPreloaderProps {
  /** The URL to begin downloading in the background. */
  url: string;
}

/**
 * Invisible component. Starts fetching `url` into the blob cache while the
 * current scene plays, so VideoPlayer for the next scene starts instantly.
 * Revokes the blob on unmount if no VideoPlayer consumed it.
 */
export function BlobPreloader({ url }: BlobPreloaderProps) {
  useEffect(() => preloadBlob(url), [url]);
  return null;
}
