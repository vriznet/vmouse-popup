/* eslint-disable react-hooks/exhaustive-deps */
// #region : imports
import {
  RefObject,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { IPopupProps } from '../types/props';
import {
  ActionMap,
  Coord,
  PopupComponentAppearances,
  PopupComponentName,
} from '../types/data';
import useVMouseAction from '../hooks/useVMouseAction';
import { useDispatch, useSelector } from 'react-redux';
import {
  deltaUpdateScreenComponentCoord,
  updateScreenComponentVisibility,
} from '../redux/module/screenSlice';
import {
  selectClickedCoord,
  selectCursorX,
  selectCursorY,
  selectMouseActionState,
} from '../redux/module/mouseSlice';
import { PopupComponentMouseActionStates } from '../types/states';
import {
  initialComponentMouseActionState,
  initialPopupComponentMouseActionStates,
  popupComponentNameList,
} from '../data';
import {
  selectPopupComponentAppearances,
  selectPopupComponentLastClickedComponentName,
  setPopupComponentLastClickedComponentName,
  updatePopupComponentAppearance,
} from '../redux/module/popupSlice';
import PopupCloseButton from './PopupCloseButton';
import PopupOkButton from './PopupOkButton';
import { BOUNDARY_MARGIN } from '../constants';
// #endregion : imports

// #region : types
interface IPopupContainerProps {
  $isHovered: boolean;
  $isVisible: boolean;
  $coord: Coord;
}

interface IPopupHeaderProps {
  $isParentHovered: boolean;
}
// #endregion : types

// #region : styled components
const PopupContainer = styled.div.attrs<IPopupContainerProps>((props) => ({
  style: {
    top: `${props.$coord.y}px`,
    left: `${props.$coord.x}px`,
    display: props.$isVisible ? 'flex' : 'none',
  },
}))<IPopupContainerProps>`
  position: absolute;
  width: 240px;
  border: 1px solid #000;
  z-index: 998;
  color: ${(props) => (props.$isHovered ? '#fff' : '#000')};
  background-color: ${(props) => (props.$isHovered ? '#000' : '#fff')};
  flex-direction: column;
  padding-bottom: 16px;
  justify-content: flex-start;
  align-items: center;
`;

const PopupHeader = styled.header<IPopupHeaderProps>`
  height: 16px;
  line-height: 16px;
  border-bottom: 1px solid
    ${(props) => (props.$isParentHovered ? '#fff' : '#000')};
  font-size: 11px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 6px;
`;

const PopupTitle = styled.h1``;

const PopupContent = styled.div`
  padding: 24px 0 16px 0;
  height: 24px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
// #endregion : styled components

const Popup = forwardRef<HTMLDivElement, IPopupProps>((props, ref) => {
  // #region : states
  const [popupComponentMouseActionStates, setPopupComponentMouseActionStates] =
    useState<PopupComponentMouseActionStates>(
      initialPopupComponentMouseActionStates
    );
  const [hoveredPopupComponentName, setHoveredPopupComponentName] =
    useState<PopupComponentName>('');
  const [prevHoveredPopupComponentName, setPrevHoveredPopupComponentName] =
    useState<PopupComponentName>('');
  // #endregion : states

  // #region : redux
  const dispatch = useDispatch();

  const cursorCoordX = useSelector(selectCursorX);
  const cursorCoordY = useSelector(selectCursorY);
  const popupComponentAppearances = useSelector(
    selectPopupComponentAppearances
  );
  const mouseActionState = useSelector(selectMouseActionState);
  const clickedCoord = useSelector(selectClickedCoord);
  const clickedComponentName = useSelector(
    selectPopupComponentLastClickedComponentName
  );
  // #endregion : redux

  // #region : refs
  const popupContainerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLDivElement>(null);
  const okButtonRef = useRef<HTMLDivElement>(null);
  const headerBarRef = useRef<HTMLDivElement>(null);
  // #endregion : refs

  useImperativeHandle(ref, () => popupContainerRef.current!, []);

  // #region : getPopupComponentNameFromPoint
  const getPopupComponentNameFromPoint = useCallback(
    (point: Coord): PopupComponentName => {
      const popupComponentNameAndZIndexes: {
        name: PopupComponentName;
        zIndex: number;
      }[] = [];

      const container = popupContainerRef.current;
      const { x: containerX, y: containerY } =
        container?.getBoundingClientRect() || { x: 0, y: 0 };

      let key: keyof PopupComponentAppearances;
      for (key in popupComponentAppearances) {
        const appearanceData = popupComponentAppearances[key];
        if (
          appearanceData.x + containerX + appearanceData.width >= point.x &&
          appearanceData.y + containerY + appearanceData.height >= point.y &&
          appearanceData.x + containerX <= point.x &&
          appearanceData.y + containerY <= point.y
        ) {
          popupComponentNameAndZIndexes.push({
            name: key,
            zIndex: appearanceData.zIndex,
          });
        }
      }
      const sortedNameAndZIndexes = popupComponentNameAndZIndexes.sort(
        (a, b) => b.zIndex - a.zIndex
      );
      return sortedNameAndZIndexes.length > 0
        ? sortedNameAndZIndexes[0].name
        : '';
    },
    [popupComponentAppearances]
  );
  // #endregion : getPopupComponentNameFromPoint

  // #region : update redux store's PopupComponentAppearance by ref
  const updateReduxPopupComponentAppearanceByRef = (
    ref: RefObject<HTMLElement>,
    componentName: PopupComponentName
  ) => {
    const element = ref.current;
    const container = popupContainerRef.current;

    if (element && container) {
      const {
        x: elementX,
        y: elementY,
        width: elementWidth,
        height: elementHeight,
      } = element.getBoundingClientRect();
      const elementComputedStyle = window.getComputedStyle(element);
      const elementZIndex = parseInt(elementComputedStyle.zIndex || '0', 10);
      const elementBorderLeftWidth = parseInt(
        elementComputedStyle.borderLeftWidth || '0',
        10
      );
      const elementBorderTopWidth = parseInt(
        elementComputedStyle.borderTopWidth || '0',
        10
      );

      const { x: containerX, y: containerY } =
        container.getBoundingClientRect();

      dispatch(
        updatePopupComponentAppearance({
          componentName,
          appearance: {
            x: elementX - elementBorderLeftWidth - containerX,
            y: elementY - elementBorderTopWidth - containerY,
            width: elementWidth,
            height: elementHeight,
            zIndex: elementZIndex,
          },
        })
      );
    }
  };
  // #endregion : update redux store's PopupComponentAppearance by ref

  // #region : action map
  const actionMap: ActionMap = {
    isShortClicked() {},
    isDblClicked() {},
    isLongClickStarted() {},
    isLongClickEnded() {},
  };
  // #endregion : action map

  useVMouseAction(props.mouseActionState, actionMap);

  // #region : effects
  // #region :: props.isVisible effect
  useEffect(() => {
    if (props.isVisible) {
      updateReduxPopupComponentAppearanceByRef(closeButtonRef, 'close');
      updateReduxPopupComponentAppearanceByRef(okButtonRef, 'ok');
      updateReduxPopupComponentAppearanceByRef(headerBarRef, 'headerBar');
    }
  }, [props.isVisible]);
  // #endregion :: props.isVisible effect

  // #region :: setting hoveredComponentName - cursorCoordX, cursorCoordY, popupComponentAppearances, props.isVisible, props.isHovered dependency
  useEffect(() => {
    if (props.isVisible && props.isHovered) {
      const hoveredComponentName = getPopupComponentNameFromPoint({
        x: cursorCoordX,
        y: cursorCoordY,
      });
      setHoveredPopupComponentName(hoveredComponentName);
    }
  }, [
    cursorCoordX,
    cursorCoordY,
    popupComponentAppearances,
    props.isVisible,
    props.isHovered,
  ]);
  // #endregion :: setting hoveredComponentName - cursorCoordX, cursorCoordY, popupComponentAppearances, props.isVisible, props.isHovered dependency

  // #region :: mouseActionState.isClickStarted, mouseActionState.isClickEnded, props.isHovered, hoveredPopupComponentName dependency
  useEffect(() => {
    if (props.isHovered) {
      if (mouseActionState.isClickStarted === true) {
        dispatch(
          setPopupComponentLastClickedComponentName(hoveredPopupComponentName)
        );
      }
      if (mouseActionState.isClickEnded === true) {
        dispatch(setPopupComponentLastClickedComponentName(''));
      }
    }
  }, [
    mouseActionState.isClickStarted,
    mouseActionState.isClickEnded,
    props.isHovered,
    hoveredPopupComponentName,
  ]);
  // #endregion :: mouseActionState.isClickStarted, mouseActionState.isClickEnded, props.isHovered, hoveredPopupComponentName dependency

  // #region :: updating popup component visibility & prevHoveredPopupComponentName & popupComponentMouseActionStates - hoveredPopupComponentName, mouseActionState, prevHoveredPopupComponentName dependency
  useEffect(() => {
    if (
      (mouseActionState.isShortClicked ||
        mouseActionState.isLongClickEnded ||
        mouseActionState.isDblClicked) &&
      !props.isHovered
    ) {
      dispatch(
        updateScreenComponentVisibility({
          componentName: 'popup',
          visibility: false,
        })
      );
      setHoveredPopupComponentName('');
    }

    setPopupComponentMouseActionStates((prev) => ({
      ...prev,
      ...popupComponentNameList.reduce((acc, name) => {
        acc[name] = initialComponentMouseActionState;
        return acc;
      }, {} as PopupComponentMouseActionStates),
    }));
    if (hoveredPopupComponentName !== prevHoveredPopupComponentName) {
      setPrevHoveredPopupComponentName(hoveredPopupComponentName);
    }
    setPopupComponentMouseActionStates((prev) => ({
      ...prev,
      [hoveredPopupComponentName]: {
        ...prev[hoveredPopupComponentName],
        isShortClicked: mouseActionState.isShortClicked,
        isDblClicked: mouseActionState.isDblClicked,
        isLongClickStarted: mouseActionState.isLongClickStarted,
        isLongClickEnded: mouseActionState.isLongClickEnded,
      },
    }));
  }, [
    hoveredPopupComponentName,
    mouseActionState,
    prevHoveredPopupComponentName,
  ]);
  // #endregion :: updating popup component visibility & prevHoveredPopupComponentName & popupComponentMouseActionStates - hoveredPopupComponentName, mouseActionState, prevHoveredPopupComponentName dependency

  // #region :: dragging popup component
  useEffect(() => {
    if (mouseActionState.isClicking) {
      if (
        clickedComponentName === 'headerBar' &&
        popupContainerRef?.current &&
        props.screenContainerRef?.current
      ) {
        const popupContainerClientRect =
          popupContainerRef.current.getBoundingClientRect();
        const screenContainerClientRect =
          props.screenContainerRef.current?.getBoundingClientRect();
        dispatch(
          deltaUpdateScreenComponentCoord({
            componentName: 'popup',
            deltaX: cursorCoordX - clickedCoord.x,
            deltaY: cursorCoordY - clickedCoord.y,
            boundary: {
              width: screenContainerClientRect?.width || 0,
              height: screenContainerClientRect?.height || 0,
            },
            boundaryMargin: BOUNDARY_MARGIN,
            componentWidth: popupContainerClientRect.width,
            componentHeight: popupContainerClientRect.height,
          })
        );
      }
    }
  }, [
    popupContainerRef,
    props.screenContainerRef,
    mouseActionState.isClicking,
    hoveredPopupComponentName,
    cursorCoordX,
    cursorCoordY,
    clickedCoord,
  ]);
  // #endregion :: dragging popup component
  // #endregion : effects

  return (
    <PopupContainer
      ref={popupContainerRef}
      $coord={props.coord}
      $isHovered={props.isHovered}
      $isVisible={props.isVisible}
    >
      <PopupHeader $isParentHovered={props.isHovered} ref={headerBarRef}>
        <PopupTitle>{props.title}</PopupTitle>
        <PopupCloseButton
          ref={closeButtonRef}
          mouseActionState={popupComponentMouseActionStates.close}
          isHovered={hoveredPopupComponentName === 'close'}
          setHoveredPopupComponentName={setHoveredPopupComponentName}
        />
      </PopupHeader>
      <PopupContent>
        <p>{props.content}</p>
      </PopupContent>
      <PopupOkButton
        ref={okButtonRef}
        mouseActionState={popupComponentMouseActionStates.ok}
        isHovered={hoveredPopupComponentName === 'ok'}
        setHoveredPopupComponentName={setHoveredPopupComponentName}
        okMessage="확인"
      />
    </PopupContainer>
  );
});

export default memo(Popup);
