import { forwardRef, memo, useEffect } from 'react';
import { styled } from 'styled-components';
import { IButtonProps } from '../types/props';

const ButtonSC = styled.div`
  border: 1px solid #000;
  width: fit-content;
  padding: 4px 8px;
  border-radius: 4px;
  z-index: 5;
`;

const Button = forwardRef<HTMLDivElement, IButtonProps>((props, ref) => {
  useEffect(() => {
    if (props.mouseActionState.isShortClicked) {
      console.log('open popup');
    }
    if (props.mouseActionState.isDblClicked) {
      console.log('open popup double');
    }
    if (props.mouseActionState.isLongClickStarted) {
      console.log('open popup long start');
    }
    if (props.mouseActionState.isLongClickEnded) {
      console.log('open popup long end');
    }
  }, [props.mouseActionState]);
  return <ButtonSC ref={ref}>Open Popup</ButtonSC>;
});

export default memo(Button);
