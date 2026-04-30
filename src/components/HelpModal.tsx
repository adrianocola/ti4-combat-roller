import React, {useEffect} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import Button from '@/components/Button';
import D10Image from '@assets/d10.png';
import ResetImage from '@assets/reset.png';

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

const Icon: React.FC<{src: string; alt: string; reset?: boolean}> = ({
  src,
  alt,
  reset,
}) => (
  <span
    className={`inline-flex items-center justify-center w-7 h-7 rounded-md align-middle mx-1 ${
      reset ? 'bg-app-reset' : 'bg-app-button'
    }`}>
    <img src={src} alt={alt} className="w-4 h-4" />
  </span>
);

const Row: React.FC<{title: React.ReactNode; children: React.ReactNode}> = ({
  title,
  children,
}) => (
  <li className="mt-3">
    <div className="text-app-white font-semibold text-sm">{title}</div>
    <div className="text-app-gray text-sm mt-0.5 leading-snug">{children}</div>
  </li>
);

const HelpModal: React.FC<HelpModalProps> = ({visible, onClose}) => {
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.2}}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute inset-0 bg-black/75"
          />
          <div className="relative bg-app-modal rounded-[25px] p-5 sm:p-6 flex flex-col w-[90%] max-w-md md:max-w-lg overflow-y-auto max-h-[85vh] shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
            <h2 className="text-app-white font-bold text-center text-xl">
              How it works
            </h2>

            <ul className="mt-2">
              <Row title="Add / remove dice">
                Tap right half of a row to add, left half to remove. Max 15 per
                face.
              </Row>
              <Row title="Roll / reset">
                <Icon src={D10Image} alt="Roll" /> rolls all dice.{' '}
                <Icon src={ResetImage} alt="Reset" reset /> clears the current
                set.
              </Row>
              <Row title="Result button (center)">
                Shows hit count + chance. Tap to open the probability table.
              </Row>
              <Row title="Switch dice set">
                Swipe horizontally, tap{' '}
                <span className="text-app-white">‹ ›</span>, or use{' '}
                <span className="text-app-white">← →</span> keys.
              </Row>
              <Row title="Hits = roll ≥ face number">
                Number on the left of each row is the target face.
              </Row>
            </ul>

            <Button
              onClick={onClose}
              transparent
              title="✖︎"
              className="absolute top-2.5 right-2.5"
              titleClassName="text-app-gray font-normal text-2xl"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(HelpModal);
