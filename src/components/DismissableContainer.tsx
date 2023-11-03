/* eslint-disable react-hooks/exhaustive-deps */
// #region : imports
import styled from 'styled-components';
import { Coord } from '../types/data';
import { IDismissableContainerProps } from '../types/props';
import { forwardRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateScreenComponentVisibility } from '../redux/module/screenSlice';
// #endregion : imports

// #region : types
interface IContainerSCProps {
  padding: number;
  border: string;
  $width: number;
  $height: number;
  $isHovered: boolean;
  $isVisible: boolean;
  $coord: Coord;
  backgroundColor?: string;
}
// #endregion : types

// #region : styled components
const ContainerSC = styled.div.attrs<IContainerSCProps>((props) => ({
  style: {
    left: `${props.$coord.x}px`,
    top: `${props.$coord.y}px`,
    display: props.$isVisible ? 'flex' : 'none',
    width: `${props.$width}px`,
    height: `${props.$height}px`,
  },
}))<IContainerSCProps>`
  position: absolute;
  z-index: 999;
  padding: ${(props) => props.padding}px;
  border: ${(props) => props.border};
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : '#fff'};
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

  useEffect(() => {
    if (
      (props.mouseActionState.isShortClicked ||
        props.mouseActionState.isLongClickEnded ||
        props.mouseActionState.isDblClicked) &&
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
    props.mouseActionState.isDblClicked,
    props.mouseActionState.isLongClickEnded,
    props.mouseActionState.isShortClicked,
    props.parentComponentName,
  ]);

  return (
    <ContainerSC
      padding={props.padding}
      border={props.border}
      $width={props.$width}
      $height={props.$height}
      $isHovered={props.$isHovered}
      $isVisible={props.$isVisible}
      $coord={props.$coord}
      backgroundColor={props.backgroundColor}
      ref={ref}
    >
      {props.children}
    </ContainerSC>
  );
});

export default DismissableContainer;
