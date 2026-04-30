export const CHANGE_DICE_SET_EVENT = 'changeDiceSet';

export type ChangeDiceSetDelta = 1 | -1;

export const emitChangeDiceSet = (delta: ChangeDiceSetDelta) => {
  window.dispatchEvent(
    new CustomEvent<ChangeDiceSetDelta>(CHANGE_DICE_SET_EVENT, {
      detail: delta,
    }),
  );
};
