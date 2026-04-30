import React from 'react';
import {ColorSet, FACES_DISPLAY} from '@/data/consts';
import DiceLine from '@/components/DiceLine';

interface DiceListProps {
  colorSet: ColorSet;
}

const DiceList: React.FC<DiceListProps> = ({colorSet}) => {
  return (
    <div className="flex flex-col w-full h-full">
      {FACES_DISPLAY.map(face => (
        <DiceLine key={face} colorSet={colorSet} face={face} />
      ))}
    </div>
  );
};

export default React.memo(DiceList);
