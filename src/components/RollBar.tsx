import React, {useCallback, useMemo, useState} from 'react';
import {getChanceText} from '@/utils/chance';
import {store} from '@/store';
import {reset, roll, setRolling} from '@/store/diceSetSlice';
import {rollDices} from '@/utils/dice';
import {MAX_ROLL_MS} from '@/data/consts';
import {Events, trackEvent} from '@/services/analytics';
import {arraySum} from '@/utils/array';
import {useAppDispatch, useAppSelector} from '@/hooks/storeHooks';
import StatsModal from '@/components/StatsModal';

import D10Image from '@assets/d10.png';
import ResetImage from '@assets/reset.png';

const RollBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const dicesColorSet = useAppSelector(state => state.diceSet);
  const selectedColorSet = useAppSelector(
    state => state.settings.selectedColorSet,
  );
  const [statsModalVisible, setStatsModalVisible] = useState(false);

  const diceCount = useMemo(
    () =>
      Object.values(dicesColorSet[selectedColorSet].dices).reduce(
        (acc, set) => acc + set.length,
        0,
      ),
    [dicesColorSet, selectedColorSet],
  );

  const onRoll = useCallback(async () => {
    const rolling = store.getState().diceSet[selectedColorSet]?.rolling;
    if (rolling) return;

    dispatch(setRolling({colorSet: selectedColorSet, rolling: true}));

    const {dices, chances, chancesAccumulative} =
      await rollDices(selectedColorSet);

    dispatch(
      roll({colorSet: selectedColorSet, dices, chances, chancesAccumulative}),
    );

    setTimeout(() => {
      dispatch(setRolling({colorSet: selectedColorSet, rolling: false}));
    }, MAX_ROLL_MS);
  }, [dispatch, selectedColorSet]);

  const onReset = useCallback(() => {
    trackEvent(Events.RESET);
    dispatch(reset({colorSet: selectedColorSet}));
  }, [dispatch, selectedColorSet]);

  const toggleStatsModal = useCallback(() => {
    trackEvent(Events.VIEW_STATS);
    setStatsModalVisible(v => !v);
  }, []);

  const resultsTotal = useMemo(() => {
    return arraySum(Object.values(dicesColorSet[selectedColorSet].results));
  }, [dicesColorSet, selectedColorSet]);

  const canRoll = !dicesColorSet[selectedColorSet].rolling && diceCount !== 0;
  const accChances = dicesColorSet[selectedColorSet].chancesAccumulative;

  return (
    <>
      <div className="grid grid-cols-3 items-center w-full pb-[15px] px-4 sm:px-8">
        <div className="justify-self-start">
          <button
            type="button"
            aria-label="Reset"
            disabled={!canRoll}
            onClick={onReset}
            className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-md bg-app-reset border border-app-white/20 transition active:opacity-50 disabled:opacity-25">
            <img src={ResetImage} alt="" className="w-6 h-6" />
          </button>
        </div>
        <button
          type="button"
          aria-label="Hit chances"
          disabled={diceCount === 0}
          onClick={toggleStatsModal}
          className="justify-self-center w-24 h-12 flex flex-col items-center justify-center bg-app-button border border-app-white/20 rounded-md transition active:opacity-50 disabled:opacity-25 leading-none">
          <span className="text-app-white font-bold text-[22px] leading-none">
            {resultsTotal}
          </span>
          <span className="text-app-gray text-[11px] leading-none mt-1 tabular-nums">
            {accChances.length
              ? `${getChanceText(accChances[resultsTotal])}%`
              : '—%'}
          </span>
        </button>
        <div className="justify-self-end">
          <button
            type="button"
            aria-label="Roll"
            disabled={!canRoll}
            onClick={onRoll}
            className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-md bg-app-button border border-app-white/20 transition active:opacity-50 disabled:opacity-25">
            <img src={D10Image} alt="" className="w-6 h-6" />
          </button>
        </div>
      </div>
      <StatsModal
        colorSet={selectedColorSet}
        resultsTotal={resultsTotal}
        visible={statsModalVisible}
        onClose={toggleStatsModal}
      />
    </>
  );
};

export default RollBar;
