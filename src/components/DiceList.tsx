import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {ColorSet, FACES_DISPLAY} from '@data/consts';
import DiceLine from '@components/DiceLine';

interface DiceListProps {
  rollId: number;
  colorSet: ColorSet;
  dices: Dices;
  results: Results;
  rolling: boolean;
  onAddDice: (colorSet: ColorSet, face: Face) => void;
  onRemoveDice: (colorSet: ColorSet, face: Face) => void;
}

const DiceList: React.FC<DiceListProps> = ({
  rollId,
  colorSet,
  dices,
  results,
  rolling,
  onAddDice,
  onRemoveDice,
}) => {
  const innerOnAddDice = useCallback(
    (face: Face) => {
      onAddDice(colorSet, face);
    },
    [onAddDice, colorSet],
  );

  const innerOnRemoveDice = useCallback(
    (face: Face) => {
      onRemoveDice(colorSet, face);
    },
    [onRemoveDice, colorSet],
  );

  return (
    <View style={styles.container}>
      {FACES_DISPLAY.map(face => (
        <DiceLine
          key={face}
          colorSet={colorSet}
          face={face}
          dices={dices[face]}
          rolling={rolling}
          rollId={rollId}
          result={results[face] ?? 0}
          onAddDice={innerOnAddDice}
          onRemoveDice={innerOnRemoveDice}
        />
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
