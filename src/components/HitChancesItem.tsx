import React from 'react';
import {getChanceText} from '@/utils/chance';

interface HitChancesItemProps {
  hits: number;
  exactChance: number;
  accChance: number;
  total: number;
  currentResult: number;
}

export const ITEM_HEIGHT = 28;

const getHitsLabel = (hits: number, total: number) => {
  if (hits === 0) return 'No hits';
  if (hits === total - 1) return `All (${hits})`;
  return `${hits} hit${hits > 1 ? 's' : ''}`;
};

const HitChancesItem: React.FC<HitChancesItemProps> = ({
  hits,
  exactChance,
  accChance,
  total,
  currentResult,
}) => {
  const isCurrent = currentResult === hits;
  const baseText = isCurrent ? 'text-app-selected font-bold' : 'text-app-white';
  return (
    <div className="grid grid-cols-3 items-center rounded-[3px] border-[0.5px] border-app-gray-dark bg-app-button px-2 my-[3px] text-sm h-[28px]">
      <span className={`${baseText} text-left`}>
        {getHitsLabel(hits, total)}
      </span>
      {hits === 0 || hits === total - 1 ? (
        <span className={`${baseText} text-right tabular-nums col-span-2`}>
          {getChanceText(exactChance)}%
        </span>
      ) : (
        <>
          <span className={`${baseText} text-right tabular-nums`}>
            {getChanceText(accChance)}%
          </span>
          <span className={`${baseText} text-right tabular-nums`}>
            {getChanceText(exactChance)}%
          </span>
        </>
      )}
    </div>
  );
};

export default React.memo(HitChancesItem);
