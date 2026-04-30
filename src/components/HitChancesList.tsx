import React, {useEffect, useMemo, useRef} from 'react';
import {
  calcAccumulativeSuccessChances,
  calcExactSuccessChances,
} from '@/utils/chance';
import HitChancesItem, {ITEM_HEIGHT} from '@/components/HitChancesItem';
import {ColorSet} from '@/data/consts';
import {useAppSelector} from '@/hooks/storeHooks';

interface HitChancesListProps {
  colorSet: ColorSet;
  resultsTotal: number;
}

const ROW_GAP = 6;

const HitChancesList: React.FC<HitChancesListProps> = ({
  colorSet,
  resultsTotal,
}) => {
  const diceSet = useAppSelector(state => state.diceSet[colorSet]);
  const listRef = useRef<HTMLDivElement>(null);
  const firstRenderRef = useRef(true);

  const exactChances = useMemo(
    () => calcExactSuccessChances(diceSet.dices),
    [diceSet.dices],
  );

  const accChances = useMemo(
    () => calcAccumulativeSuccessChances(exactChances),
    [exactChances],
  );

  const total = exactChances.length;

  useEffect(() => {
    requestAnimationFrame(() => {
      const el = listRef.current;
      if (!el) return;
      const rowStride = ITEM_HEIGHT + ROW_GAP;
      const rowOffset = rowStride * resultsTotal;
      const top = rowOffset - el.clientHeight / 2 + ITEM_HEIGHT / 2;
      el.scrollTo({
        top: Math.max(0, top),
        behavior: firstRenderRef.current ? 'instant' : 'smooth',
      });
      firstRenderRef.current = false;
    });
  }, [resultsTotal, total]);

  return (
    <div className="flex flex-col flex-1 min-h-0 mt-4">
      <div className="grid grid-cols-3 px-2 pb-1.5 text-xs font-semibold uppercase tracking-wider text-app-gray">
        <span />
        <span className="text-right">At least</span>
        <span className="text-right">Exactly</span>
      </div>
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto rounded-md py-1 px-2">
        {exactChances.map((exact, index) => (
          <HitChancesItem
            key={index}
            hits={index}
            exactChance={exact}
            accChance={accChances[index]}
            total={total}
            currentResult={resultsTotal}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(HitChancesList);
