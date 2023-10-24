// #region : imports
import { forwardRef, memo } from 'react';
import styled from 'styled-components';
import { IPopupCloseButtonProps } from '../types/props';
import useVMouseAction from '../hooks/useVMouseAction';
import { ActionMap } from '../types/data';
import { useDispatch } from 'react-redux';
import { updateScreenComponentVisibility } from '../redux/module/screenSlice';
// #endregion : imports

// #region : types
interface IPopupCloseButtonSCProps {
  $isHovered: boolean;
}
// #endregion : types

// #region : styled components
const PopupCloseButtonSC = styled.div<IPopupCloseButtonSCProps>`
  color: ${(props) => (props.$isHovered ? '#00ff00' : '#ccc')};
`;
// #endregion : styled components

const PopupCloseButton = forwardRef<HTMLDivElement, IPopupCloseButtonProps>(
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
        <PopupCloseButtonSC ref={ref} $isHovered={props.isHovered}>
          X
        </PopupCloseButtonSC>
      </>
    );
  }
);

export default memo(PopupCloseButton);
