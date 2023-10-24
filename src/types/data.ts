// #region : imports
import { ComponentMouseActionState } from './states';
// #endregion : imports

// #region : common
export type Coord = {
  x: number;
  y: number;
};

export type Appearance = {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
};

export type ActionMap = {
  [key in keyof ComponentMouseActionState]: () => void;
};
// #endregion : common

// #region : screen component
export type ScreenComponentName = '' | 'popup' | 'modal' | 'button';

export type ScreenComponentAppearances = {
  [componentName in ScreenComponentName]: Appearance;
};

export type ScreenComponentVisibilities = {
  [componentName in ScreenComponentName]: boolean;
};

export type PartialScreenComponentAppearance = Partial<
  Record<keyof Appearance, any>
>;

export type ScreenComponentLastClickedCoords = {
  [componentName in ScreenComponentName]: Coord;
};
// #endregion : screen component

// #region : popup component
export type PopupComponentName = '' | 'close' | 'ok' | 'headerBar';

export type PopupComponentAppearances = {
  [componentName in PopupComponentName]: Appearance;
};

export type PartialPopupComponentAppearance = Partial<
  Record<keyof Appearance, any>
>;

export type PopupComponentLastClickedCoords = {
  [componentName in PopupComponentName]: Coord;
};
// #endregion : popup component
