import { forwardRef, memo, useState } from 'react';
import { styled } from 'styled-components';
import { IButtonProps } from '../types/props';
import useVMouseAction from '../hooks/useVMouseAction';
import { ActionMap } from '../types/data';

interface IButtonSCProps {
  $isHovered: boolean;
}

const ButtonSC = styled.div<IButtonSCProps>`
  border: 1px solid #000;
  width: fit-content;
  padding: 4px 8px;
  border-radius: 4px;
  z-index: 5;
  background-color: ${(props) => (props.$isHovered ? '#000' : '#fff')};
  color: ${(props) => (props.$isHovered ? '#fff' : '#000')};
`;

const Button = forwardRef<HTMLDivElement, IButtonProps>((props, ref) => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const actionMap: ActionMap = {
    isHoverStarted: () => {
      setIsButtonHovered(true);
    },
    isHoverEnded: () => {
      setIsButtonHovered(false);
    },
    isShortClicked: () => console.log('open popup'),
    isDblClicked: () => console.log('open popup double'),
    isLongClickStarted: () => console.log('open popup long start'),
    isLongClickEnded: () => console.log('open popup long end'),
  };

  useVMouseAction(props.mouseActionState, actionMap);

  return (
    <ButtonSC ref={ref} $isHovered={isButtonHovered}>
      Open Popup
    </ButtonSC>
  );
});

export default memo(Button);
