import { ComponentMouseActionState } from './states';

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
  lastClickedCoord: Coord;
};

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

export type ActionMap = {
  [key in keyof ComponentMouseActionState]: () => void;
};

export type PopupComponentName = '' | 'close' | 'ok';

export type PopupComponentAppearances = {
  [componentName in PopupComponentName]: Appearance;
};

export type PartialPopupComponentAppearance = Partial<
  Record<keyof Appearance, any>
>;
