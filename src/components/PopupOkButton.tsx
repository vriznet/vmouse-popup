import { forwardRef, memo } from 'react';
import styled from 'styled-components';
import { IPopupOkButtonProps } from '../types/props';
import { useDispatch } from 'react-redux';
import { ActionMap } from '../types/data';
import { updateScreenComponentVisibility } from '../redux/module/screenSlice';
import useVMouseAction from '../hooks/useVMouseAction';

interface IPopupOkButtonSCProps {
  $isHovered: boolean;
}

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

const PopupOkButton = forwardRef<HTMLDivElement, IPopupOkButtonProps>(
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
        <PopupOkButtonSC ref={ref} $isHovered={props.isHovered}>
          {props.okMessage}
        </PopupOkButtonSC>
      </>
    );
  }
);

export default memo(PopupOkButton);
