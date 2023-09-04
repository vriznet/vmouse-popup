import { styled } from 'styled-components';
import Cursor from './Cursor';
import { useSelector } from 'react-redux';
import { selectCursorX, selectCursorY } from '../redux/module/mouseSlice';
import { memo } from 'react';

const Container = styled.div`
  width: 320px;
  height: 240px;
  border: 1px solid #000;
`;

const Screen = () => {
  const cursorCoordX = useSelector(selectCursorX);
  const cursorCoordY = useSelector(selectCursorY);

  return (
    <Container>
      <Cursor x={cursorCoordX} y={cursorCoordY} />
    </Container>
  );
};

export default memo(Screen);
