import { forwardRef, useEffect, useRef, useImperativeHandle, type VideoHTMLAttributes } from 'react';

interface VideoPlayerProps extends VideoHTMLAttributes<HTMLVideoElement> {
  sourceSrc: string;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({ sourceSrc, ...props }, forwardedRef) => {
  const internalRef = useRef<HTMLVideoElement>(null);

  // Sync internal ref with forwarded ref
  useImperativeHandle(forwardedRef, () => internalRef.current as HTMLVideoElement);

  useEffect(() => {
    const video = internalRef.current;
    return () => {
      // Extensive cleanup to ensure GPU releases the video memory reliably upon unmount
      if (video) {
        video.pause();
        video.removeAttribute('src');
        const sources = video.querySelectorAll('source');
        sources.forEach(source => source.removeAttribute('src'));
        video.load();
      }
    };
  }, []);

  return (
    <video ref={internalRef} {...props}>
      <source src={sourceSrc} type="video/mp4" />
    </video>
  );
});
