// #region : imports
import { forwardRef, memo } from 'react';
import styled from 'styled-components';
import { IPopupOkButtonProps } from '../types/props';
import { useDispatch } from 'react-redux';
import { ActionMap } from '../types/data';
import { updateScreenComponentVisibility } from '../redux/module/screenSlice';
import useVMouseAction from '../hooks/useVMouseAction';
// #endregion : imports

// #region : types
interface IPopupOkButtonSCProps {
  $isHovered: boolean;
}
// #endregion : types

// #region : styled components
const PopupOkButtonSC = styled.div<IPopupOkButtonSCProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => (props.$isHovered ? '#00ff00' : '#ccc')};
  font-size: 11px;
  border: 1px solid ${(props) => (props.$isHovered ? '#00ff00' : '#ccc')};
  width: fit-content;
  padding: 4px 8px;
`;
// #endregion : styled components

const PopupOkButton = forwardRef<HTMLDivElement, IPopupOkButtonProps>(
  (props, ref) => {
    const dispatch = useDispatch();

    // #region : action map
    const actionMap: ActionMap = {
      isShortClicked() {
        dispatch(
          updateScreenComponentVisibility({
            componentName: 'popup',
            visibility: false,
          })
        );
        props.setHoveredPopupComponentName('');
      },
      isDblClicked() {},
      isLongClickStarted() {},
      isLongClickEnded() {},
    };
    // #endregion : action map

    useVMouseAction(props.mouseActionState, actionMap);

    return (
      <>
        <PopupOkButtonSC ref={ref} $isHovered={props.isHovered}>
          {props.okMessage}
        </PopupOkButtonSC>
      </>
    );
  }
);

export default memo(PopupOkButton);
