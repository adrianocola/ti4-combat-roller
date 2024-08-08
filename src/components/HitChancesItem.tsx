import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Colors from '@/data/colors';
import {getChanceText, getSuccessesText} from '@/utils/chance';

interface HitChancesItemProps {
  hits: number;
  chance: number;
  total: number;
  currentResult: number;
  showExactResult: boolean;
}

export const ITEM_HEIGHT = 20;

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
    alignItems: 'center',
    flexDirection: 'row',
    height: ITEM_HEIGHT,
    marginVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 3,
    borderColor: Colors.GRAY_DARK,
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
