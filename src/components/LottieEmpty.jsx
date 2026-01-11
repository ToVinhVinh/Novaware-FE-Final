import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const DEFAULT_SRC =
  'https://lottie.host/f6052d25-1140-4e80-9a1f-b625e5352a19/FmrnTTtT4U.lottie'
const LottieEmpty = ({
  src = DEFAULT_SRC,
  loop = true,
  autoplay = true,
  className = undefined,
  style = undefined,
}) => {
  return (
    <div className={className} style={{ transform: 'scale(0.7)' }} aria-busy="true" aria-live="polite">
      <DotLottieReact src={src} loop={loop} autoplay={autoplay} />
    </div>
  );
};

export default LottieEmpty;


