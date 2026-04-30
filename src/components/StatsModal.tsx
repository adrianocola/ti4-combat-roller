import React, {useEffect} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {ColorSet} from '@/data/consts';
import HitChancesList from '@/components/HitChancesList';
import Button from '@/components/Button';

interface StatsModalProps {
  colorSet: ColorSet;
  resultsTotal: number;
  visible: boolean;
  onClose: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({
  colorSet,
  resultsTotal,
  visible,
  onClose,
}) => {
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
          <div className="relative bg-app-modal rounded-[25px] p-5 flex flex-col w-[90%] max-w-md md:max-w-lg lg:max-w-xl max-h-[80vh] min-h-80 shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
            <h2 className="text-app-white font-bold text-center text-xl">
              Hit Chances
            </h2>
            <HitChancesList colorSet={colorSet} resultsTotal={resultsTotal} />
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

export default React.memo(StatsModal);
