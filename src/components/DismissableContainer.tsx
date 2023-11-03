/* eslint-disable react-hooks/exhaustive-deps */
// #region : imports
import styled from 'styled-components';
import { Coord } from '../types/data';
import { IDismissableContainerProps } from '../types/props';
import { forwardRef, memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateScreenComponentVisibility } from '../redux/module/screenSlice';
import { selectMouseActionState } from '../redux/module/mouseSlice';
// #endregion : imports

// #region : types
interface IContainerSCProps {
  $padding: number;
  $border: string;
  $isHovered: boolean;
  $isVisible: boolean;
  $coord: Coord;
  $width?: number;
  $height?: number;
  $backgroundColor?: string;
}
// #endregion : types

// #region : styled components
const ContainerSC = styled.div.attrs<IContainerSCProps>((props) => ({
  style: {
    left: `${props.$coord.x}px`,
    top: `${props.$coord.y}px`,
    display: props.$isVisible ? 'flex' : 'none',
    width: `${props.$width ? props.$width : 'auto'}`,
    height: `${props.$height ? props.$height : 'auto'}`,
  },
}))<IContainerSCProps>`
  position: absolute;
  z-index: 900;
  padding: ${(props) => props.$padding}px;
  border: ${(props) => props.$border};
  background-color: ${(props) =>
    props.$backgroundColor ? props.$backgroundColor : '#fff'};
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
// #endregion : styled components

const DismissableContainer = forwardRef<
  HTMLDivElement,
  IDismissableContainerProps
>((props, ref) => {
  const dispatch = useDispatch();

  const mouseActionState = useSelector(selectMouseActionState);

  useEffect(() => {
    if (
      (mouseActionState.isShortClicked ||
        mouseActionState.isLongClickEnded ||
        mouseActionState.isDblClicked) &&
      !props.$isHovered
    ) {
      dispatch(
        updateScreenComponentVisibility({
          componentName: props.parentComponentName,
          visibility: false,
        })
      );
    }
  }, [
    props.$isHovered,
    mouseActionState.isDblClicked,
    mouseActionState.isLongClickEnded,
    mouseActionState.isShortClicked,
    props.parentComponentName,
  ]);

  return (
    <ContainerSC
      $padding={props.$padding}
      $border={props.$border}
      $width={props.$width}
      $height={props.$height}
      $isHovered={props.$isHovered}
      $isVisible={props.$isVisible}
      $coord={props.$coord}
      $backgroundColor={props.$backgroundColor}
      ref={ref}
    >
      {props.children}
    </ContainerSC>
  );
});

export default memo(DismissableContainer);
