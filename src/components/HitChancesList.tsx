import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ListRenderItemInfo} from '@react-native/virtualized-lists/Lists/VirtualizedList';
import {
  calcAccumulativeSuccessChances,
  calcExactSuccessChances,
} from '@utils/chance';
import HitChancesItem, {ITEM_HEIGHT} from '@components/HitChancesItem';
import Button from '@components/Button';
import {ColorSet} from '@data/consts';
import {useAppSelector} from '@hooks/storeHooks';

interface HitChancesListProps {
  colorSet: ColorSet;
  resultsTotal: number;
}

const HitChancesList: React.FC<HitChancesListProps> = ({
  colorSet,
  resultsTotal,
}) => {
  const [showExactResult, setShowExactResult] = useState(false);
  const diceSet = useAppSelector(state => state.diceSet[colorSet]);
  const listRef = useRef<FlatList>(null);
  const firstRenderRef = useRef(true);

  // aways calculate when opening the modal (user might open it without rolling the dice)
  const rawChancesList: number[] = useMemo(() => {
    return calcExactSuccessChances(diceSet.dices);
  }, [diceSet.dices]);

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

  const getItemLayout = useCallback(
    (data: unknown, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  useEffect(() => {
    listRef.current?.flashScrollIndicators();
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({
        index: resultsTotal,
        animated: !firstRenderRef.current,
      });
      firstRenderRef.current = false;
    });
  }, [resultsTotal]);

  return (
    <View style={styles.container}>
      <View style={styles.options}>
        <Button
          onPress={() => setShowExactResult(false)}
          title="At Least X Hits"
          transparent={showExactResult}
          titleStyle={showExactResult && styles.notSelectedOption}
        />
        <Button
          onPress={() => setShowExactResult(true)}
          title="Exactly X Hits"
          transparent={!showExactResult}
          titleStyle={!showExactResult && styles.notSelectedOption}
        />
      </View>
      <FlatList
        ref={listRef}
        data={chancesList}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        style={styles.list}
        indicatorStyle="white"
        contentContainerStyle={styles.listContent}
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
  notSelectedOption: {
    fontWeight: 'normal',
    textDecorationLine: 'underline',
  },
  list: {
    marginTop: 20,
    marginBottom: 10,
    overflow: 'hidden',
    borderRadius: 5,
    paddingVertical: 10,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
});

export default React.memo(HitChancesList);
