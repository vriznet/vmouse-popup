// #region : imports
import { forwardRef, memo } from 'react';
import { styled } from 'styled-components';
import { IButtonProps } from '../types/props';
import useVMouseAction from '../hooks/useVMouseAction';
import { ActionMap } from '../types/data';
// #endregion : imports

// #region : types
interface IButtonSCProps {
  $isHovered: boolean;
}
// #endregion : types

// #region : styled components
const ButtonSC = styled.div<IButtonSCProps>`
  border: 1px solid #000;
  width: fit-content;
  padding: 4px 8px;
  border-radius: 4px;
  z-index: 5;
  background-color: ${(props) => (props.$isHovered ? '#000' : '#fff')};
  color: ${(props) => (props.$isHovered ? '#fff' : '#000')};
`;
// #endregion : styled components

const Button = forwardRef<HTMLDivElement, IButtonProps>((props, ref) => {
  // #region : action map
  const actionMap: ActionMap = {
    isShortClicked() {
      props.onVShortClick();
    },
    isDblClicked() {
      props.onVDblClick();
    },
    isLongClickStarted() {
      props.onVLongClickStart();
    },
    isLongClickEnded() {
      props.onVLongClickEnd();
    },
  };
  // #endregion : action map

  useVMouseAction(props.mouseActionState, actionMap);

  return (
    <ButtonSC ref={ref} $isHovered={props.isHovered}>
      Open Popup
    </ButtonSC>
  );
});

export default memo(Button);
