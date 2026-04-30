import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import DiceList from '@/components/DiceList';
import {BASE_SCREEN_ORDER, ColorSet} from '@/data/consts';
import {Events, trackEvent} from '@/services/analytics';
import {
  setSelectedColorSet,
  setShowInitialAnimation,
} from '@/store/settingsSlice';
import {arrayRotate} from '@/utils/array';
import {store} from '@/store';
import {useAppDispatch, useAppSelector} from '@/hooks/storeHooks';
import {
  CHANGE_DICE_SET_EVENT,
  type ChangeDiceSetDelta,
} from '@/services/diceSetEvents';

const centerScreenOrder = (
  screenOrder: ColorSet[],
  selectedColorSet: ColorSet,
) => {
  const selectedIndex = screenOrder.indexOf(selectedColorSet);
  return arrayRotate(screenOrder, selectedIndex - 2);
};

const DiceSets: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedColorSet = useAppSelector(
    state => state.settings.selectedColorSet,
  );
  const [screenOrder, setScreenOrder] = useState(() =>
    centerScreenOrder(BASE_SCREEN_ORDER, selectedColorSet),
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedColorSetRef = useRef(selectedColorSet);
  const screenOrderRef = useRef(screenOrder);
  const widthRef = useRef(0);
  const userInteractedRef = useRef(false);

  useEffect(() => {
    selectedColorSetRef.current = selectedColorSet;
    screenOrderRef.current = screenOrder;
  });

  const onScrollEnd = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !widthRef.current) return;
    if (!userInteractedRef.current) return;
    userInteractedRef.current = false;

    const selectedIndex = Math.round(el.scrollLeft / widthRef.current);
    const newColorSet = screenOrderRef.current?.[selectedIndex];
    if (!newColorSet || newColorSet === selectedColorSetRef.current) return;

    trackEvent(Events.CHANGE_SET, {colorSet: newColorSet});

    dispatch(setSelectedColorSet({selectedColorSet: newColorSet}));
    setScreenOrder(prev => arrayRotate(prev, selectedIndex - 2));
  }, [dispatch]);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => {
      widthRef.current = el.clientWidth;
      el.scrollTo({left: 2 * el.clientWidth, behavior: 'instant'});
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [screenOrder]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onPointerDown = () => {
      userInteractedRef.current = true;
    };
    const onWheel = () => {
      userInteractedRef.current = true;
    };

    let scrollTimeout: ReturnType<typeof setTimeout> | undefined;
    const onScrollEndPolyfill = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(onScrollEnd, 120);
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('wheel', onWheel, {passive: true});

    const supportsScrollEnd = 'onscrollend' in window;
    if (supportsScrollEnd) {
      el.addEventListener('scrollend', onScrollEnd);
    } else {
      el.addEventListener('scroll', onScrollEndPolyfill, {passive: true});
    }

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('scrollend', onScrollEnd);
      el.removeEventListener('scroll', onScrollEndPolyfill);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [onScrollEnd]);

  useEffect(() => {
    if (selectedColorSet === screenOrderRef.current[2]) return;
    setScreenOrder(centerScreenOrder(BASE_SCREEN_ORDER, selectedColorSet));
  }, [selectedColorSet]);

  useEffect(() => {
    const onChange = (e: Event) => {
      const delta = (e as CustomEvent<ChangeDiceSetDelta>).detail;
      const el = scrollRef.current;
      if (!el || !widthRef.current) return;
      const currentIndex = Math.round(el.scrollLeft / widthRef.current);
      const targetIndex = currentIndex + delta;
      if (targetIndex < 0 || targetIndex >= screenOrderRef.current.length)
        return;
      userInteractedRef.current = true;
      el.scrollTo({
        left: targetIndex * widthRef.current,
        behavior: 'smooth',
      });
    };
    window.addEventListener(CHANGE_DICE_SET_EVENT, onChange);
    return () => window.removeEventListener(CHANGE_DICE_SET_EVENT, onChange);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const showInitialAnimation =
        store.getState().settings.showInitialAnimation;
      if (!showInitialAnimation) return;
      const el = scrollRef.current;
      if (!el) return;

      store.dispatch(setShowInitialAnimation({showInitialAnimation: false}));
      el.scrollTo({left: 2 * el.clientWidth + 70, behavior: 'smooth'});
      setTimeout(() => {
        el.scrollTo({left: 2 * el.clientWidth, behavior: 'smooth'});
      }, 600);
    }, 500);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="flex flex-row w-full h-full overflow-x-auto overflow-y-hidden no-scrollbar snap-x snap-mandatory [scroll-behavior:auto]">
      {screenOrder.map(colorSet => (
        <div
          key={colorSet}
          className="shrink-0 w-full h-full snap-center snap-always">
          <DiceList colorSet={colorSet} />
        </div>
      ))}
    </div>
  );
};

export default DiceSets;
