import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
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
import { updateScreenComponentVisibility } from '../redux/module/screenSlice';
import {
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
  updatePopupComponentAppearance,
} from '../redux/module/popupSlice';
import PopupCloseButton from './PopupCloseButton';

interface IPopupContainerProps {
  $isHovered: boolean;
  $isVisible: boolean;
}

interface IPopupHeaderProps {
  $isParentHovered: boolean;
}

const PopupContainer = styled.div<IPopupContainerProps>`
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
  flex-direction: column;
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
  padding: 8px;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Popup = forwardRef<HTMLDivElement, IPopupProps>((props, ref) => {
  const [popupComponentMouseActionStates, setPopupComponentMouseActionStates] =
    useState<PopupComponentMouseActionStates>(
      initialPopupComponentMouseActionStates
    );
  const [hoveredPopupComponentName, setHoveredPopupComponentName] =
    useState<PopupComponentName>('');
  const [prevHoveredPopupComponentName, setPrevHoveredPopupComponentName] =
    useState<PopupComponentName>('');

  const cursorCoordX = useSelector(selectCursorX);
  const cursorCoordY = useSelector(selectCursorY);

  const popupComponentAppearances = useSelector(
    selectPopupComponentAppearances
  );

  const mouseActionState = useSelector(selectMouseActionState);

  const closeButtonRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const getPopupComponentNameFromPoint = useCallback(
    (point: Coord): PopupComponentName => {
      const popupComponentNameAndZIndexes: {
        name: PopupComponentName;
        zIndex: number;
      }[] = [];

      let key: keyof PopupComponentAppearances;
      for (key in popupComponentAppearances) {
        const appearanceData = popupComponentAppearances[key];
        if (
          appearanceData.x + appearanceData.width >= point.x &&
          appearanceData.y + appearanceData.height >= point.y &&
          appearanceData.x < point.x &&
          appearanceData.y < point.y
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

  const actionMap: ActionMap = {
    isShortClicked() {},
    isDblClicked() {},
    isLongClickStarted() {},
    isLongClickEnded() {},
  };

  useVMouseAction(props.mouseActionState, actionMap);

  useEffect(() => {
    if (props.isVisible) {
      const closeButton = closeButtonRef.current;
      if (closeButton) {
        const { x, y, width, height } = closeButton.getBoundingClientRect();
        const zIndex = parseInt(closeButton.style.zIndex || '0', 10);
        dispatch(
          updatePopupComponentAppearance({
            componentName: 'close',
            appearance: {
              x,
              y,
              width,
              height,
              zIndex,
            },
          })
        );
      }
    }
  }, [props.isVisible]);

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

  return (
    <PopupContainer
      ref={ref}
      $isHovered={props.isHovered}
      $isVisible={props.isVisible}
    >
      <PopupHeader $isParentHovered={props.isHovered}>
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
    </PopupContainer>
  );
});

export default memo(Popup);
