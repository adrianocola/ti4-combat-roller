import React, {useEffect} from 'react';
import {store} from '@/store';
import {downloadMoreRandomData} from '@/utils/dice';
import {Events, trackEvent} from '@/services/analytics';
import RollBar from '@/components/RollBar';
import DiceSets from '@/components/DiceSets';
import Header from '@/components/Header';
import InstallPrompt from '@/components/InstallPrompt';
import {emitChangeDiceSet} from '@/services/diceSetEvents';

const CombatRoller: React.FC = () => {
  useEffect(() => {
    trackEvent(Events.OPEN, {
      colorSet: store.getState().settings.selectedColorSet,
    });
    downloadMoreRandomData();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        emitChangeDiceSet(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        emitChangeDiceSet(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-full bg-app-bg">
      <Header />
      <main className="flex-1 w-full flex items-center justify-center min-h-0 max-w-[900px]">
        <DiceSets />
      </main>
      <footer className="w-full bg-app-bg pt-2 sm:pt-[15px] max-w-[900px] pb-[calc(env(safe-area-inset-bottom)+6px)]">
        <RollBar />
      </footer>
      <InstallPrompt />
    </div>
  );
};

export default CombatRoller;
