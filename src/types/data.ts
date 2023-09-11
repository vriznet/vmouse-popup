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
  isVisible: boolean;
  zIndex: number;
};

export type ScreenComponentName = '' | 'popup' | 'modal' | 'button';

export type ScreenComponentAppearances = {
  [componentName in ScreenComponentName]: Appearance;
};

export type PartialScreenComponentAppearance = Partial<
  Record<keyof Appearance, any>
>;

export type ActionMap = {
  [key in keyof ComponentMouseActionState]: () => void;
};
