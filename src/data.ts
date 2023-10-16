import { PopupComponentName, ScreenComponentName } from './types/data';

export const initialComponentMouseActionState = {
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

export const popupComponentNameList: PopupComponentName[] = [
  '',
  'close',
  'ok',
  'headerBar',
];

export const initialPopupComponentMouseActionStates = {
  '': initialComponentMouseActionState,
  close: initialComponentMouseActionState,
  ok: initialComponentMouseActionState,
  headerBar: initialComponentMouseActionState,
};
