import React, {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{outcome: 'accepted' | 'dismissed'}>;
}

const STORAGE_KEY = 'ti4InstallDismissed';

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  // iOS Safari uses navigator.standalone
  (navigator as Navigator & {standalone?: boolean}).standalone === true;

const isMobile = () =>
  window.matchMedia('(pointer: coarse)').matches &&
  window.matchMedia('(max-width: 900px)').matches;

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) &&
  !(navigator as Navigator & {MSStream?: unknown}).MSStream;

const isIOSSafari = () =>
  isIOS() && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(navigator.userAgent);

const computeEligibility = () => {
  if (isStandalone()) return {eligible: false, ios: false};
  if (!isMobile()) return {eligible: false, ios: false};
  try {
    if (localStorage.getItem(STORAGE_KEY)) return {eligible: false, ios: false};
  } catch {
    // ignore
  }
  return {eligible: true, ios: isIOSSafari()};
};

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const initial = (() => computeEligibility())();
  const [showIos, setShowIos] = useState(initial.eligible && initial.ios);
  const [dismissed, setDismissed] = useState(!initial.eligible);

  useEffect(() => {
    if (dismissed) return;
    if (showIos) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    const installedHandler = () => {
      setDeferredPrompt(null);
      setShowIos(false);
      setDismissed(true);
    };
    window.addEventListener('appinstalled', installedHandler);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, [dismissed, showIos]);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore
    }
    setDismissed(true);
  };

  const onInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (result.outcome === 'accepted') {
      dismiss();
    }
  };

  const visible = !dismissed && (deferredPrompt || showIos);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{y: 80, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          exit={{y: 80, opacity: 0}}
          transition={{duration: 0.25}}
          className="fixed left-3 right-3 bottom-[calc(env(safe-area-inset-bottom)+12px)] z-40 mx-auto max-w-md rounded-xl bg-app-modal border border-app-white/15 shadow-[0_4px_12px_rgba(0,0,0,0.5)] px-4 py-3 flex flex-row items-center gap-3">
          <img
            src="/icon.png"
            alt=""
            className="w-10 h-10 rounded-md shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-app-white text-sm font-semibold leading-tight">
              Install TI4 Combat Roller
            </p>
            <p className="text-app-gray text-xs mt-0.5 leading-snug">
              {showIos
                ? 'Tap the share icon then "Add to Home Screen".'
                : 'Add to your home screen for one-tap access.'}
            </p>
          </div>
          {deferredPrompt && (
            <button
              type="button"
              onClick={onInstall}
              className="shrink-0 rounded-md bg-app-selected/90 text-black text-sm font-semibold px-3 py-1.5 active:opacity-70">
              Install
            </button>
          )}
          <button
            type="button"
            aria-label="Dismiss"
            onClick={dismiss}
            className="shrink-0 text-app-gray text-lg leading-none px-1 active:opacity-50">
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
