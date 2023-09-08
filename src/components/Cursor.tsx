import { memo } from 'react';
import { styled } from 'styled-components';

interface ICursorProps {
  x: number;
  y: number;
}

interface ICursorSCProps {
  x: number;
  y: number;
}

const CursorSC = styled.div.attrs<ICursorSCProps>((props) => ({
  style: {
    top: `${props.y}px`,
    left: `${props.x}px`,
  },
}))`
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #000;
  opacity: 0.5;
`;

const Cursor = (props: ICursorProps) => {
  return <CursorSC x={props.x} y={props.y} />;
};

export default memo(Cursor);
