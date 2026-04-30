import React, {useState} from 'react';
import HelpModal from '@/components/HelpModal';
import {emitChangeDiceSet} from '@/services/diceSetEvents';

const Arrow: React.FC<{
  direction: 'left' | 'right';
  onClick: () => void;
  ariaLabel: string;
}> = ({direction, onClick, ariaLabel}) => (
  <button
    type="button"
    aria-label={ariaLabel}
    onClick={onClick}
    className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center text-app-white transition active:opacity-50 hover:text-app-selected leading-none">
    <span className="text-[28px] sm:text-[40px] leading-none -mt-1 sm:-mt-1.5">
      {direction === 'left' ? '‹' : '›'}
    </span>
  </button>
);

const Header: React.FC = () => {
  const [helpVisible, setHelpVisible] = useState(false);

  return (
    <>
      <header className="flex w-full max-w-[900px] mx-auto px-3 sm:px-6 pb-2 sm:pb-4 flex-col items-center pt-[calc(env(safe-area-inset-top)+8px)]">
        <div className="flex flex-row items-center justify-between w-full gap-2 sm:gap-4">
          <Arrow
            direction="left"
            onClick={() => emitChangeDiceSet(-1)}
            ariaLabel="Previous color set"
          />
          <div className="flex flex-col items-center flex-1 min-w-0">
            <div className="flex flex-row items-center gap-2">
              <h1 className="text-app-white font-bold text-base sm:text-xl tracking-wide leading-tight">
                TI4 Combat Roller
              </h1>
              <button
                type="button"
                aria-label="Help"
                onClick={() => setHelpVisible(true)}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-app-button border border-app-white/20 flex items-center justify-center text-app-white text-xs sm:text-sm font-bold hover:bg-app-white/10 active:opacity-50 transition leading-none">
                ?
              </button>
            </div>
            <p className="text-app-gray-dark text-[10px] sm:text-xs mt-0.5 sm:mt-1 text-center leading-tight">
              <span className="md:hidden">
                Swipe or tap arrows to switch dice set
              </span>
              <span className="hidden md:inline">
                Swipe / Shift+Wheel / ← → keys to switch dice set
              </span>
            </p>
          </div>
          <Arrow
            direction="right"
            onClick={() => emitChangeDiceSet(1)}
            ariaLabel="Next color set"
          />
        </div>
      </header>
      <HelpModal visible={helpVisible} onClose={() => setHelpVisible(false)} />
    </>
  );
};

export default Header;
