import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Colors from '@data/colors';

interface HitChancesItemProps {
  hits: number;
  chance: number;
  total: number;
  currentResult: number;
  showExactResult: boolean;
}

const getSuccessesText = (
  successes: number,
  total: number,
  showExactResult: boolean,
) => {
  if (successes === 0) {
    return 'No hits';
  }
  if (successes === total - 1) {
    return `All (${successes})`;
  }

  const hits = `${successes} hit${successes > 1 ? 's' : ''}`;
  return `${showExactResult ? 'Exactly' : 'At least'} ${hits}`;
};

const getChanceText = (chance: number) => {
  chance *= 100;

  if (chance === 100) {
    return '100';
  }
  if (chance > 99.99) {
    return '99.99';
  }
  if (chance === 0) {
    return '0';
  }
  if (chance < 0.01) {
    return '0.01';
  }

  return chance.toFixed(2);
};

const HitChancesItem: React.FC<HitChancesItemProps> = ({
  hits,
  chance,
  total,
  currentResult,
  showExactResult,
}) => {
  return (
    <View style={[styles.listItem]}>
      <Text
        style={[
          styles.listItemText,
          currentResult === hits && styles.currentResult,
        ]}>
        {getSuccessesText(hits, total, showExactResult)}
      </Text>
      <Text
        style={[
          styles.listItemText,
          currentResult === hits && styles.currentResult,
        ]}>
        {getChanceText(chance)} %
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 3,
    marginVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 3,
    borderColor: Colors.SEPARATOR,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: Colors.BACKGROUND_BUTTON,
  },
  listItemText: {
    color: Colors.WHITE,
  },
  currentResult: {
    fontWeight: 'bold',
    color: Colors.SELECTED,
  },
});

export default React.memo(HitChancesItem);
