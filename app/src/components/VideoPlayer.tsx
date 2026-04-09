import { forwardRef, useEffect, useRef, useImperativeHandle, type VideoHTMLAttributes } from 'react';

interface VideoPlayerProps extends VideoHTMLAttributes<HTMLVideoElement> {
  sourceSrc: string;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({ sourceSrc, autoPlay, ...props }, forwardedRef) => {
  const internalRef = useRef<HTMLVideoElement>(null);

  useImperativeHandle(forwardedRef, () => internalRef.current as HTMLVideoElement);

  // Explicitly call .play() on mount when autoPlay is requested.
  // The `autoplay` HTML attribute can be unreliable when video src comes from
  // a <source> child (vs. directly on the element), especially after React
  // Strict Mode's mount→unmount→remount cycle.
  useEffect(() => {
    const video = internalRef.current;
    if (!video || !autoPlay) return;
    video.play().catch(() => {
      // Autoplay blocked — silently ignore. The user has already clicked so
      // this should not happen in practice, only in certain browser policies.
    });
  }, [autoPlay]);

  // GPU cleanup on REAL unmount only.
  // We use a `didMount` sentinel to distinguish React Strict Mode's fake
  // unmount (mount→cleanup→remount) from a real component removal.
  // The sentinel ref persists across the fake cycle so we can skip premature cleanup.
  useEffect(() => {
    const video = internalRef.current;

    return () => {
      if (!video) return;
      // If the video element is still connected to the DOM, this is a Strict Mode
      // fake unmount — skip the destructive cleanup so autoplay still works on remount.
      if (video.isConnected) return;

      video.pause();
      // Remove src to release GPU/decoder memory
      video.removeAttribute('src');
      video.querySelectorAll('source').forEach(s => s.removeAttribute('src'));
      video.load();
    };
  }, []);

  return (
    // Pass sourceSrc directly on the element (NOT via <source> child) so the
    // browser correctly associates the buffered HTTP-cache entry with this request.
    <video ref={internalRef} src={sourceSrc} autoPlay={autoPlay} {...props} />
  );
});

VideoPlayer.displayName = 'VideoPlayer';
