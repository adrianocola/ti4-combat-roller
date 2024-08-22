import React, {useCallback, useMemo, useState} from 'react';
import ButtonImage from '@/components/ButtonImage';
import ResetImage from '@assets/reset.png';
import Button from '@/components/Button';
import {StyleSheet, Text, View} from 'react-native';
import {getChanceText} from '@/utils/chance';
import D10Image from '@assets/d10.png';
import colors from '@/data/colors';
import Colors from '@/data/colors';
import {store} from '@/store';
import {reset, roll, setRolling} from '@/store/diceSetSlice';
import {rollDices} from '@/utils/dice';
import {MAX_ROLL_MS} from '@/data/consts';
import {Events, trackEvent} from '@/services/analytics';
import {arraySum} from '@/utils/array';
import {useAppDispatch, useAppSelector} from '@/hooks/storeHooks';
import StatsModal from '@/components/StatsModal';

const RollBar = () => {
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

    // No need to clean up this timeout, it must always update the state, even if the component is unmounted
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
    setStatsModalVisible(prevStatsModalVisible => !prevStatsModalVisible);
  }, []);

  const resultsTotal = useMemo(() => {
    return arraySum(Object.values(dicesColorSet[selectedColorSet].results));
  }, [dicesColorSet, selectedColorSet]);

  const canRoll = !dicesColorSet[selectedColorSet].rolling && diceCount !== 0;

  return (
    <>
      <View style={styles.rollBar}>
        <ButtonImage
          style={[styles.button, styles.refresh]}
          disabled={!canRoll}
          onPress={onReset}
          image={ResetImage}
          imageSize={26}
        />
        <Button
          style={styles.result}
          transparent
          disabled={diceCount === 0}
          onPress={toggleStatsModal}>
          <View style={styles.resultContent}>
            <Text style={styles.resultText}>{resultsTotal}</Text>
            <Text style={styles.statsText}>
              {dicesColorSet[selectedColorSet].chancesAccumulative.length
                ? `${getChanceText(dicesColorSet[selectedColorSet].chancesAccumulative[resultsTotal])}%`
                : '%'}
            </Text>
          </View>
        </Button>
        <ButtonImage
          style={styles.button}
          disabled={!canRoll}
          onPress={onRoll}
          image={D10Image}
        />
      </View>
      <StatsModal
        colorSet={selectedColorSet}
        resultsTotal={resultsTotal}
        diceCount={diceCount}
        visible={statsModalVisible}
        onClose={toggleStatsModal}
      />
    </>
  );
};

const styles = StyleSheet.create({
  rollBar: {
    paddingBottom: 15,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginHorizontal: 20,
  },
  refresh: {
    backgroundColor: colors.BACKGROUND_RESET,
  },
  result: {
    flex: 1,
    paddingVertical: 0,
  },
  resultContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultText: {
    color: colors.WHITE,
    fontSize: 32,
    lineHeight: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statsText: {
    color: Colors.GRAY_DARK,
    fontSize: 12,
    lineHeight: 12,
    height: 10,
    textAlign: 'center',
  },
});

export default RollBar;
