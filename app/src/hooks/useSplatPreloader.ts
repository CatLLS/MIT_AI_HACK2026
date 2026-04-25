import { useEffect } from 'react';
import { OTHER } from '../assets/mediaManifest';
import { cacheUrl } from './useAssetPreloader';

/**
 * useSplatPreloader — lazily pre-warms the 3D gaussian splat into the browser's
 * HTTP disk cache when Level 5 mounts.
 *
 * The splat (~33 MB) is only needed at Level 6. The user spends several minutes
 * in the Level 5 audio sequence, giving the browser plenty of time to fetch and
 * cache it before Climax360 mounts. This avoids burning bandwidth (especially on
 * mobile) for users who may never reach Level 6.
 *
 * Because we use fetch() with cache:'force-cache', the second request (from
 * Spark's internal loader) hits the browser disk cache instantly — no stutter.
 */
export function useSplatPreloader() {
  useEffect(() => {
    cacheUrl(OTHER.SPLAT_WORLD);
  }, []);
}
