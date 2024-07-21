import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {ColorSet, FACES_DISPLAY, MAX_ROLL_MS} from '@data/consts';
import DiceLine from '@components/DiceLine';
import {finishRolling} from '@store/diceSetSlice';
import {useAppDispatch, useAppSelector} from '@hooks/storeHooks';

interface DiceListProps {
  colorSet: ColorSet;
}

const DiceList: React.FC<DiceListProps> = ({colorSet}) => {
  const rollId = useAppSelector(state => state.diceSet[colorSet].rollId);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!rollId) {
      return;
    }

    const timeout = setTimeout(() => {
      dispatch(finishRolling({colorSet}));
    }, MAX_ROLL_MS);

    return () => {
      dispatch(finishRolling({colorSet}));
      clearTimeout(timeout);
    };
  }, [colorSet, dispatch, rollId]);

  return (
    <View style={styles.container}>
      {FACES_DISPLAY.map(face => (
        <DiceLine key={face} colorSet={colorSet} face={face} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
});

export default React.memo(DiceList);
