import React, { forwardRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const DEFAULT_SRC =
  'https://lottie.host/3b1fcf27-8ddd-4b39-9bb1-0930cc3ceaca/Mg0srF2Fsh.lottie';
const LottieLoading = forwardRef(function LottieLoading(
  {
    src = DEFAULT_SRC,
    loop = true,
    autoplay = true,
    className = undefined,
    style = undefined,
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: 'scale(0.75)', ...style }}
      aria-busy="true"
      aria-live="polite"
    >
      <DotLottieReact src={src} loop={loop} autoplay={autoplay} />
    </div>
  );
});

export default LottieLoading;


