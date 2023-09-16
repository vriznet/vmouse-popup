import { ComponentMouseActionState } from './states';

export interface IButtonProps {
  mouseActionState: ComponentMouseActionState;
  onVShortClick: () => void;
  onVDblClick: () => void;
  onVLongClickStart: () => void;
  onVLongClickEnd: () => void;
}
