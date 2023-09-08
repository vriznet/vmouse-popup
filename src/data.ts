import { ScreenComponentName } from './types/data';

export const initialComponentMouseActionState = {
  isHovered: false,
  isShortClicked: false,
  isDblClicked: false,
  isLongClickStarted: false,
  isLongClickEnded: false,
};

export const initialScreenComponentMouseActionStates = {
  '': initialComponentMouseActionState,
  popup: initialComponentMouseActionState,
  modal: initialComponentMouseActionState,
  button: initialComponentMouseActionState,
};

export const screenComponentNameList: ScreenComponentName[] = [
  '',
  'popup',
  'modal',
  'button',
];
