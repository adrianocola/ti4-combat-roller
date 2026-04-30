import React, {useEffect, useRef} from 'react';
import {motion, useMotionValue, animate} from 'framer-motion';
import {ColorSet, FACES_LIST} from '@/data/consts';
import colors from '@/data/colors';
import {useAppDispatch, useAppSelector} from '@/hooks/storeHooks';
import {registerSuccess} from '@/store/diceSetSlice';

const SIZE = 20;
const FINAL_MS = 250;
const FACES_TEXT = FACES_LIST.join('\n');

interface DiceProps {
  colorSet: ColorSet;
  targetFace: Face;
  dice: DiceConfig;
}

const getPosition = (value: Face, fromEnd?: boolean) => {
  const index = fromEnd
    ? FACES_LIST.findLastIndex(p => p === value)
    : FACES_LIST.findIndex(p => p === value);
  return index * SIZE * -1;
};

// custom cubic-out easing matching Reanimated's Easing.out(Easing.cubic)
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const Dice: React.FC<DiceProps> = ({colorSet, targetFace, dice}) => {
  const alreadyRolled = dice.duration > 0;
  const stylePos = useMotionValue(
    getPosition(alreadyRolled ? dice.face : targetFace),
  );
  const frameBg = useMotionValue(
    alreadyRolled && dice.success ? colors.WHITE : 'rgba(255,255,255,0)',
  );
  const frameBorder = useMotionValue(
    alreadyRolled && !dice.success ? colors.GRAY : colors.WHITE,
  );
  const textColor = useMotionValue(
    alreadyRolled ? (dice.success ? colors.BLACK : colors.GRAY) : colors.WHITE,
  );
  const rollId = useAppSelector(state => state.diceSet[colorSet].rollId);
  const dispatch = useAppDispatch();
  const lastRollIdRef = useRef<number>(rollId);

  useEffect(() => {
    if (!rollId) return;
    if (lastRollIdRef.current === rollId) return;
    lastRollIdRef.current = rollId;
    const {face, duration, success} = dice;

    // reset state
    frameBg.set('rgba(255,255,255,0)');
    frameBorder.set(colors.WHITE);
    textColor.set(colors.WHITE);

    const posAnim = animate(stylePos, getPosition(face, true), {
      duration: duration / 1000,
      ease: easeOutCubic,
      onComplete: () => {
        stylePos.set(getPosition(face));
      },
    });

    const finalDelay = (duration - FINAL_MS) / 1000;
    const finalDur = FINAL_MS / 1000;

    const bgAnim = animate(
      frameBg,
      success ? colors.WHITE : 'rgba(255,255,255,0)',
      {duration: finalDur, delay: finalDelay},
    );
    const borderAnim = animate(
      frameBorder,
      success ? colors.WHITE : colors.GRAY,
      {duration: finalDur, delay: finalDelay},
    );
    const textAnim = animate(textColor, success ? colors.BLACK : colors.GRAY, {
      duration: finalDur,
      delay: finalDelay,
    });

    let timeout: ReturnType<typeof setTimeout> | undefined;
    if (success) {
      timeout = setTimeout(() => {
        dispatch(registerSuccess({colorSet, face: targetFace}));
      }, duration);
    }

    return () => {
      posAnim.stop();
      bgAnim.stop();
      borderAnim.stop();
      textAnim.stop();
      if (timeout) clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollId]);

  return (
    <div className="relative flex items-center justify-center m-[5px] w-[20px] h-[20px]">
      <motion.div
        className="absolute w-full h-full border rotate-45"
        style={{backgroundColor: frameBg, borderColor: frameBorder}}
      />
      <div className="overflow-hidden h-[20px]">
        <motion.div
          className='text-center text-[14px] leading-[20px] tabular-nums whitespace-pre tracking-[-0.5px] font-["Oswald",system-ui,sans-serif] font-semibold'
          style={{
            color: textColor,
            y: stylePos,
            height: FACES_LIST.length * SIZE,
          }}>
          {FACES_TEXT}
        </motion.div>
      </div>
    </div>
  );
};

export default React.memo(Dice);
