import { ScreenComponentName } from './data';

export type MouseActionState = {
  isClicking: boolean;
  isClickStarted: boolean;
  isShortClicked: boolean;
  isDblClicked: boolean;
  isLongClickStarted: boolean;
  isLongClickEnded: boolean;
};

export type ComponentMouseActionState = {
  isHovered: boolean;
  isShortClicked: boolean;
  isDblClicked: boolean;
  isLongClickStarted: boolean;
  isLongClickEnded: boolean;
};

export type ScreenComponentMouseActionStates = {
  [componentName in ScreenComponentName]: ComponentMouseActionState;
};
