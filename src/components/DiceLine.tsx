import React, {useCallback} from 'react';
import colors from '@/data/colors';
import {ColorSet, MAX_DICE_SET} from '@/data/consts';
import ButtonOverlay from './ButtonOverlay';
import Dice from './Dice';
import {useAppDispatch, useAppSelector} from '@/hooks/storeHooks';
import {addDice, removeDice} from '@/store/diceSetSlice';

interface Props {
  colorSet: ColorSet;
  face: Face;
}

const DiceLine: React.FC<Props> = ({colorSet, face}) => {
  const dispatch = useAppDispatch();
  const dices = useAppSelector(state => state.diceSet[colorSet].dices[face]);
  const rolling = useAppSelector(state => state.diceSet[colorSet].rolling);
  const result = useAppSelector(
    state => state.diceSet[colorSet].results[face] ?? 0,
  );
  const color = colors.FACES_COLORS[colorSet][face];

  const diceCount = dices?.length ?? 0;

  const onAddDice = useCallback(() => {
    dispatch(addDice({colorSet, face}));
  }, [colorSet, dispatch, face]);

  const onRemoveDice = useCallback(() => {
    dispatch(removeDice({colorSet, face}));
  }, [colorSet, dispatch, face]);

  return (
    <div
      className="relative flex flex-1 items-center justify-between w-full min-h-[50px]"
      style={{backgroundColor: color}}>
      <div className="flex flex-row justify-end w-[75px] shrink-0">
        <span className="text-app-white font-bold text-[32px]">{face}</span>
        <div className="ml-[5px] mb-[5px] w-[25px] flex items-end">
          {!!diceCount && (
            <span className="text-app-gray text-sm">x{diceCount}</span>
          )}
        </div>
      </div>
      {!diceCount && (
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      )}
      <div className="flex-1 flex flex-wrap items-center justify-center">
        {dices?.map(dice => (
          <Dice
            key={dice.id}
            colorSet={colorSet}
            targetFace={face}
            dice={dice}
          />
        ))}
      </div>
      <div className="w-[50px] shrink-0 flex items-center justify-center">
        {!!diceCount && (
          <span
            className={`text-center text-[24px] ${
              result > 0 ? 'text-app-white font-bold' : 'text-app-gray'
            }`}>
            {result}
          </span>
        )}
      </div>
      <div className="absolute inset-0 flex flex-row items-center justify-between w-full h-full">
        <ButtonOverlay
          text="-"
          className="flex-1"
          disabled={rolling || !diceCount}
          onPress={onRemoveDice}
        />
        <ButtonOverlay
          text="+"
          className="flex-1"
          disabled={rolling || diceCount >= MAX_DICE_SET}
          onPress={onAddDice}
        />
      </div>
    </div>
  );
};

export default React.memo(DiceLine);
