import React from 'react';
import {
  Modal,
  ModalProps,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '@data/colors';
import HitChancesList from '@components/HitChancesList';
import Button from '@components/Button';

interface StatsModalPros extends ModalProps {
  dices: Dices;
  resultsTotal: number;
  onClose: () => void;
}

const StatsModal: React.FC<StatsModalPros> = ({
  dices,
  resultsTotal,
  onClose,
  ...props
}) => {
  return (
    <Modal
      {...props}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={0.9}
        />
        <View style={styles.modal}>
          <Text style={styles.title}>Hit Chances</Text>
          <HitChancesList dices={dices} resultsTotal={resultsTotal} />
          <Button
            style={styles.closeContainer}
            transparent
            title="✖︎"
            titleStyle={styles.closeText}
            onPress={onClose}
            hitSlop={15}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    flex: 1,
    width: '90%',
    maxHeight: '50%',
    backgroundColor: Colors.BACKGROUND,
    shadowColor: Colors.BLACK,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.5,
    padding: 20,
    borderRadius: 25,
  },
  title: {
    fontWeight: 'bold',
    width: '100%',
    color: Colors.WHITE,
    textAlign: 'center',
    fontSize: 20,
  },
  closeContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeText: {
    fontSize: 24,
    color: Colors.GRAY,
  },
});

export default React.memo(StatsModal);