import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ListRenderItemInfo} from '@react-native/virtualized-lists/Lists/VirtualizedList';
import {
  calcAccumulativeSuccessChances,
  calcExactSuccessChances,
} from '@utils/chance';
import HitChancesItem from '@components/HitChancesItem';
import Button from '@components/Button';

interface HitChancesListProps {
  dices: Dices;
  resultsTotal: number;
}

const HitChancesList: React.FC<HitChancesListProps> = ({
  dices,
  resultsTotal,
}) => {
  const [showExactResult, setShowExactResult] = useState(false);

  const rawChancesList: number[] = useMemo(() => {
    return calcExactSuccessChances(dices);
  }, [dices]);

  const chancesList: number[] = useMemo(() => {
    return showExactResult
      ? rawChancesList
      : calcAccumulativeSuccessChances(rawChancesList);
  }, [showExactResult, rawChancesList]);

  const renderItem = useCallback(
    (info: ListRenderItemInfo<number>) => {
      return (
        <HitChancesItem
          chance={info.item}
          hits={info.index}
          total={chancesList.length}
          currentResult={resultsTotal}
          showExactResult={showExactResult}
        />
      );
    },
    [chancesList.length, resultsTotal, showExactResult],
  );

  return (
    <View style={styles.container}>
      <View style={styles.options}>
        <Button
          onPress={() => setShowExactResult(false)}
          title="At Least X Hits"
          transparent={showExactResult}
        />
        <Button
          onPress={() => setShowExactResult(true)}
          title="Exactly X Hits"
          transparent={!showExactResult}
        />
      </View>
      <FlatList
        data={chancesList}
        renderItem={renderItem}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    alignItems: 'center',
  },
  list: {
    marginTop: 20,
    marginBottom: 30,
    overflow: 'hidden',
  },
});

export default React.memo(HitChancesList);
