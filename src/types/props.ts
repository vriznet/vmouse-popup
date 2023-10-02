import { Dispatch, SetStateAction } from 'react';
import { ComponentMouseActionState } from './states';
import { PopupComponentName } from './data';

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
}

export interface IPopupCloseButtonProps {
  mouseActionState: ComponentMouseActionState;
  isHovered: boolean;
  setHoveredPopupComponentName: Dispatch<SetStateAction<PopupComponentName>>;
}
