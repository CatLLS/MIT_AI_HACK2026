import { forwardRef, useEffect, useRef, useImperativeHandle, type VideoHTMLAttributes } from 'react';

interface VideoPlayerProps extends VideoHTMLAttributes<HTMLVideoElement> {
  sourceSrc: string;
}

/**
 * Thin <video> wrapper.
 *
 * Assets are served from GCS and pre-warmed into the browser's HTTP disk cache
 * by useAssetPreloader (fetch + force-cache). When the <video> element requests
 * the same URL the browser serves it from cache instantly — no extra blob layer
 * needed. GPU resources are released on real unmount (not React Strict Mode's
 * fake unmount/remount cycle).
 */
export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ sourceSrc, autoPlay, ...props }, forwardedRef) => {
    const internalRef = useRef<HTMLVideoElement>(null);
    useImperativeHandle(forwardedRef, () => internalRef.current as HTMLVideoElement);

    // Explicit play() — the `autoplay` attribute is unreliable when `src` is
    // set via a prop (vs a <source> child), especially after React Strict Mode's
    // mount → unmount → remount cycle.
    useEffect(() => {
      if (!autoPlay) return;
      internalRef.current?.play().catch(() => {});
    }, [autoPlay]);

    // Release GPU resources on real unmount. Skip React Strict Mode fake unmounts
    // by checking isConnected before tearing down.
    useEffect(() => {
      return () => {
        const video = internalRef.current;
        if (!video || video.isConnected) return;
        video.pause();
        video.removeAttribute('src');
        video.load();
      };
    }, []);

    return (
      <video ref={internalRef} src={sourceSrc} autoPlay={autoPlay} {...props} />
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';
