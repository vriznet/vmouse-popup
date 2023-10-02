import { forwardRef, memo } from 'react';
import styled from 'styled-components';
import { IPopupCloseButtonProps } from '../types/props';
import useVMouseAction from '../hooks/useVMouseAction';
import { ActionMap } from '../types/data';
import { useDispatch } from 'react-redux';
import { updateScreenComponentVisibility } from '../redux/module/screenSlice';

interface IPopupCloseButtonSCProps {
  $isHovered: boolean;
}

const PopupCloseButtonSC = styled.div<IPopupCloseButtonSCProps>`
  color: ${(props) => (props.$isHovered ? '#ff0000' : '#ccc')};
`;

const PopupCloseButton = forwardRef<HTMLDivElement, IPopupCloseButtonProps>(
  (props, ref) => {
    const dispatch = useDispatch();

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
