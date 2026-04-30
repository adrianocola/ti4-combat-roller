import React, {useEffect, useRef} from 'react';
import {motion, useMotionValue, animate} from 'framer-motion';

interface Props {
  text: string;
  disabled?: boolean;
  className?: string;
  onPress: () => void;
}

const SWIPE_CHANGE_X_THRESHOLD = 10;
const SWIPE_DETECTION_THRESHOLD = 100;
const IN_DURATION = 0.2;
const OUT_DURATION = 0.3;

const ButtonOverlay: React.FC<Props> = ({
  text,
  disabled,
  className = '',
  onPress,
}) => {
  const pressInPageX = useRef(0);
  const swiping = useRef(false);
  const opacity = useMotionValue(0);
  const inTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const outTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const activeAnimRef = useRef<ReturnType<typeof animate> | undefined>(
    undefined,
  );

  const stopAnim = () => {
    activeAnimRef.current?.stop();
    activeAnimRef.current = undefined;
  };

  const resetVisual = () => {
    clearTimeout(inTimeoutRef.current);
    clearTimeout(outTimeoutRef.current);
    stopAnim();
    opacity.set(0);
  };

  const safetyResetRef = useRef<(() => void) | undefined>(undefined);

  const armSafetyReset = () => {
    const handler = () => {
      resetVisual();
      window.removeEventListener('pointerup', handler);
      window.removeEventListener('pointercancel', handler);
      safetyResetRef.current = undefined;
    };
    safetyResetRef.current = handler;
    window.addEventListener('pointerup', handler);
    window.addEventListener('pointercancel', handler);
  };

  const disarmSafetyReset = () => {
    if (!safetyResetRef.current) return;
    window.removeEventListener('pointerup', safetyResetRef.current);
    window.removeEventListener('pointercancel', safetyResetRef.current);
    safetyResetRef.current = undefined;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // setPointerCapture can throw on some browsers if not allowed
    }
    pressInPageX.current = e.pageX;
    swiping.current = false;
    clearTimeout(outTimeoutRef.current);
    stopAnim();
    armSafetyReset();
    inTimeoutRef.current = setTimeout(() => {
      if (swiping.current) return;
      activeAnimRef.current = animate(opacity, 1, {duration: IN_DURATION});
    }, SWIPE_DETECTION_THRESHOLD);
  };

  const fadeOut = () => {
    outTimeoutRef.current = setTimeout(
      () => {
        activeAnimRef.current = animate(opacity, 0, {duration: OUT_DURATION});
      },
      SWIPE_DETECTION_THRESHOLD + IN_DURATION * 1000,
    );
  };

  const onPointerUp = (e: React.PointerEvent) => {
    disarmSafetyReset();
    if (disabled) return;
    swiping.current =
      Math.abs(e.pageX - pressInPageX.current) > SWIPE_CHANGE_X_THRESHOLD;
    if (swiping.current) {
      resetVisual();
    } else {
      onPress();
      fadeOut();
    }
  };

  const onPointerCancel = () => {
    disarmSafetyReset();
    resetVisual();
  };

  useEffect(() => {
    return () => {
      clearTimeout(inTimeoutRef.current);
      clearTimeout(outTimeoutRef.current);
      stopAnim();
      disarmSafetyReset();
    };
  }, []);

  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      className={`relative h-full select-none touch-pan-x ${className}`.trim()}>
      <motion.div
        style={{opacity}}
        className="absolute inset-0 flex items-center justify-center pointer-events-none bg-white/40">
        <span className="text-app-white font-light text-[64px] leading-[64px] [text-shadow:0_0_3px_#000]">
          {text}
        </span>
      </motion.div>
    </button>
  );
};

export default React.memo(ButtonOverlay);
