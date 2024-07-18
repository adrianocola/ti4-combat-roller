import React, {useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '@data/colors';
import {MAX_DICE_SET} from '@data/consts';

import ButtonOverlay from './ButtonOverlay';
import Dice from './Dice';

interface Props {
  face: Face;
  dices?: DiceConfig[];
  rolling: boolean;
  rollId: number;
  result: number;
  onAddOrRemoveDice: (face: Face, remove?: boolean) => void;
}

const DiceLine: React.FC<Props> = ({
  face,
  dices,
  rolling,
  rollId,
  result,
  onAddOrRemoveDice,
}) => {
  const color = colors.FACES[face];

  const onRemoveDice = useCallback(() => {
    onAddOrRemoveDice(face, true);
  }, [onAddOrRemoveDice, face]);

  const onAddDice = useCallback(() => {
    onAddOrRemoveDice(face);
  }, [onAddOrRemoveDice, face]);

  const diceCount = dices?.length ?? 0;

  return (
    <View style={[styles.container, {backgroundColor: color}]}>
      <View style={styles.textInfo}>
        <Text style={styles.textFace}>{face}</Text>
        <View style={styles.textCountContainer}>
          {!!diceCount && <Text style={styles.textCount}>x{diceCount}</Text>}
        </View>
      </View>
      {!diceCount && <View style={styles.emptyBackground} />}
      <View style={styles.diceSet}>
        {dices?.map(dice => (
          <Dice key={dice.id} initialFace={face} rollId={rollId} dice={dice} />
        ))}
      </View>
      <View style={styles.resultContainer}>
        {!!diceCount && (
          <Text style={[styles.result, result > 0 && styles.resultHit]}>
            {result}
          </Text>
        )}
      </View>
      <View style={styles.buttonsContainer}>
        <ButtonOverlay
          text="-"
          style={styles.button}
          disabled={rolling || !diceCount}
          onPress={onRemoveDice}
        />
        <ButtonOverlay
          text="+"
          style={styles.button}
          disabled={rolling || diceCount >= MAX_DICE_SET}
          onPress={onAddDice}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emptyBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  diceSet: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  button: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.WHITE,
  },
  textInfo: {
    width: 75,
    textAlign: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  textFace: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.WHITE,
  },
  textCountContainer: {
    marginLeft: 5,
    marginBottom: 5,
    width: 25,
    textAlign: 'center',
    justifyContent: 'flex-end',
  },
  textCount: {
    color: colors.GRAY,
  },
  resultContainer: {
    width: 50,
    textAlign: 'center',
    justifyContent: 'center',
  },
  result: {
    fontSize: 24,
    textAlign: 'center',
    color: colors.GRAY,
  },
  resultHit: {
    fontWeight: 'bold',
    color: colors.WHITE,
  },
});

export default React.memo(DiceLine);
