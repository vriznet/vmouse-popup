import { forwardRef, memo } from 'react';
import styled from 'styled-components';
import { IPopupProps } from '../types/props';
import { ActionMap } from '../types/data';
import useVMouseAction from '../hooks/useVMouseAction';
import { useDispatch } from 'react-redux';
import { updateScreenComponentVisibility } from '../redux/module/screenSlice';

interface IPopupSCProps {
  $isHovered: boolean;
  $isVisible: boolean;
}

const PopupSC = styled.div<IPopupSCProps>`
  position: absolute;
  top: 40px;
  left: 40px;
  width: 240px;
  height: 160px;
  border: 1px solid #000;
  z-index: 998;
  color: ${(props) => (props.$isHovered ? '#fff' : '#000')};
  background-color: ${(props) => (props.$isHovered ? '#000' : '#fff')};
  display: ${(props) => (props.$isVisible ? 'flex' : 'none')};
`;

const Popup = forwardRef<HTMLDivElement, IPopupProps>((props, ref) => {
  const dispatch = useDispatch();

  const actionMap: ActionMap = {
    isShortClicked() {
      dispatch(
        updateScreenComponentVisibility({
          componentName: 'popup',
          visibility: false,
        })
      );
    },
    isDblClicked() {},
    isLongClickStarted() {},
    isLongClickEnded() {},
  };

  useVMouseAction(props.mouseActionState, actionMap);

  return (
    <PopupSC
      ref={ref}
      $isHovered={props.isHovered}
      $isVisible={props.isVisible}
    >
      Popup
    </PopupSC>
  );
});

export default memo(Popup);
