import { forwardRef, useState, useEffect, useRef, useImperativeHandle, type VideoHTMLAttributes } from 'react';
import { consumeBlob } from '../lib/blobCache';

interface VideoPlayerProps extends VideoHTMLAttributes<HTMLVideoElement> {
  sourceSrc: string;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ sourceSrc, autoPlay, ...props }, forwardedRef) => {
    const internalRef = useRef<HTMLVideoElement>(null);
    useImperativeHandle(forwardedRef, () => internalRef.current as HTMLVideoElement);

    // ── Synchronously pick the best available URL on first mount ──────────────
    // consumeBlob() returns the pre-warmed blob URL if BlobPreloader ran ahead.
    // useState lazy initialiser runs during React's render phase — before any
    // cleanup effects — so the blob is always claimed before BlobPreloader revokes.
    const [{ videoSrc, releaseFn }] = useState(() => {
      const consumed = consumeBlob(sourceSrc);
      if (consumed) {
        // Blob was pre-warmed by BlobPreloader. Start from memory — no network.
        return { videoSrc: consumed.blobUrl, releaseFn: consumed.release };
      }
      // No blob ready yet — fall back to CDN URL. Video will stream normally.
      return { videoSrc: sourceSrc, releaseFn: () => {} };
    });

    // ── Explicit play() call ──────────────────────────────────────────────────
    // The `autoplay` attribute is unreliable when src is set via a prop (vs a
    // <source> child), especially after React Strict Mode's mount→unmount→remount.
    useEffect(() => {
      if (!autoPlay) return;
      internalRef.current?.play().catch(() => {});
    }, [autoPlay]);

    // ── GPU + blob cleanup on REAL unmount ────────────────────────────────────
    // Skips if isConnected (React Strict Mode fake unmount).
    useEffect(() => {
      return () => {
        releaseFn(); // Revoke blob URL (no-op if CDN URL was used)
        const video = internalRef.current;
        if (!video || video.isConnected) return;
        video.pause();
        video.removeAttribute('src');
        video.load();
      };
    }, [releaseFn]);

    return (
      <video ref={internalRef} src={videoSrc} autoPlay={autoPlay} {...props} />
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';
