import { forwardRef, memo, useState } from 'react';
import styled from 'styled-components';
import { IPopupProps } from '../types/props';
import { ActionMap } from '../types/data';
import useVMouseAction from '../hooks/useVMouseAction';
import { useDispatch } from 'react-redux';
import { updateScreenComponentVisibility } from '../redux/module/screenSlice';
import { updateMouseActionState } from '../redux/module/mouseSlice';

interface IPopupSCProps {
  $isHovered: boolean;
  $isVisible: boolean;
}

const PopupSC = styled.div<IPopupSCProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 160px;
  border: 1px solid #000;
  z-index: 998;
  color: ${(props) => (props.$isHovered ? '#fff' : '#000')};
  background-color: ${(props) => (props.$isHovered ? '#000' : '#fff')};
  display: ${(props) => (props.$isVisible ? 'flex' : 'none')};
`;

const Popup = forwardRef<HTMLDivElement, IPopupProps>((props, ref) => {
  const [isPopupHovered, setIsPopupHovered] = useState(false);

  const dispatch = useDispatch();

  const actionMap: ActionMap = {
    isHoverStarted() {
      setIsPopupHovered(true);
    },
    isHoverEnded() {
      setIsPopupHovered(false);
    },
    isShortClicked() {
      dispatch(
        updateScreenComponentVisibility({
          componentName: 'popup',
          visibility: false,
        })
      );
      dispatch(
        updateMouseActionState({
          isShortClicked: false,
        })
      );
    },
    isDblClicked() {
      dispatch(
        updateMouseActionState({
          isDblClicked: false,
        })
      );
    },
    isLongClickStarted() {
      dispatch(
        updateMouseActionState({
          isLongClickStarted: false,
        })
      );
    },
    isLongClickEnded() {
      dispatch(
        updateMouseActionState({
          isLongClickEnded: false,
        })
      );
    },
  };

  useVMouseAction(props.mouseActionState, actionMap);

  return (
    <PopupSC ref={ref} $isHovered={isPopupHovered} $isVisible={props.isVisible}>
      Popup
    </PopupSC>
  );
});

export default memo(Popup);
