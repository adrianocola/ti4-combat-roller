import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ColorSet, FACES_DISPLAY} from '@/data/consts';
import DiceLine from '@/components/DiceLine';

interface DiceListProps {
  colorSet: ColorSet;
}

const DiceList: React.FC<DiceListProps> = ({colorSet}) => {
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
