import { ComponentMouseActionState } from './states';

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
}
