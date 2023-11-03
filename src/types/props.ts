import { Dispatch, SetStateAction } from 'react';
import { ComponentMouseActionState } from './states';
import { Coord, PopupComponentName, ScreenComponentName } from './data';

export interface IButtonProps {
  mouseActionState: ComponentMouseActionState;
  isHovered: boolean;
  onVShortClick: () => void;
  onVDblClick: () => void;
  onVLongClickStart: () => void;
  onVLongClickEnd: () => void;
}

export interface IPopupProps {
  mouseActionState: ComponentMouseActionState;
  isVisible: boolean;
  isHovered: boolean;
  title: string;
  content: string;
  coord: Coord;
  screenContainerRef: React.RefObject<HTMLDivElement>;
}

export interface IPopupCloseButtonProps {
  mouseActionState: ComponentMouseActionState;
  isHovered: boolean;
  setHoveredPopupComponentName: Dispatch<SetStateAction<PopupComponentName>>;
}

export interface IPopupOkButtonProps {
  mouseActionState: ComponentMouseActionState;
  isHovered: boolean;
  setHoveredPopupComponentName: Dispatch<SetStateAction<PopupComponentName>>;
  okMessage: string;
}

export interface IDismissableContainerProps {
  children: React.ReactNode;
  mouseActionState: ComponentMouseActionState;
  parentComponentName: ScreenComponentName;
  padding: number;
  border: string;
  $width: number;
  $height: number;
  $isHovered: boolean;
  $isVisible: boolean;
  $coord: Coord;
  backgroundColor?: string;
}
