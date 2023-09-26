import { styled } from 'styled-components';
import Cursor from './Cursor';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCursorX,
  selectCursorY,
  selectMouseActionState,
} from '../redux/module/mouseSlice';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  selectScreenComponentAppearances,
  selectScreenComponentVisibilities,
  updateScreenComponentAppearance,
  updateScreenComponentVisibility,
} from '../redux/module/screenSlice';
import Button from './Button';
import { ScreenComponentMouseActionStates } from '../types/states';
import {
  initialComponentMouseActionState,
  initialScreenComponentMouseActionStates,
  screenComponentNameList,
} from '../data';
import {
  Coord,
  ScreenComponentAppearances,
  ScreenComponentName,
} from '../types/data';
import Popup from './Popup';

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 240px;
  border: 1px solid #000;
  z-index: 999;
`;

const Screen = () => {
  const [
    screenComponentMouseActionStates,
    setScreenComponentMouseActionStates,
  ] = useState<ScreenComponentMouseActionStates>(
    initialScreenComponentMouseActionStates
  );

  const [hoveredScreenComponentName, setHoveredScreenComponentName] =
    useState<ScreenComponentName>('');
  const [prevHoveredScreenComponentName, setPrevHoveredScreenComponentName] =
    useState<ScreenComponentName>('');

  const cursorCoordX = useSelector(selectCursorX);
  const cursorCoordY = useSelector(selectCursorY);

  const screenComponentAppearances = useSelector(
    selectScreenComponentAppearances
  );

  const screenComponentVisibilities = useSelector(
    selectScreenComponentVisibilities
  );

  const mouseActionState = useSelector(selectMouseActionState);

  const buttonRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const getScreenComponentNameFromPoint = useCallback(
    (point: Coord): ScreenComponentName => {
      const screenComponentNameAndVisibilityAndZIndexes: {
        name: ScreenComponentName;
        isVisible: boolean;
        zIndex: number;
      }[] = [];

      let key: keyof ScreenComponentAppearances;
      for (key in screenComponentAppearances) {
        const appearanceData = screenComponentAppearances[key];
        const visibilityData = screenComponentVisibilities[key];
        if (
          appearanceData.x + appearanceData.width >= point.x &&
          appearanceData.y + appearanceData.height >= point.y &&
          appearanceData.x < point.x &&
          appearanceData.y < point.y &&
          visibilityData
        ) {
          screenComponentNameAndVisibilityAndZIndexes.push({
            name: key,
            isVisible: visibilityData,
            zIndex: appearanceData.zIndex,
          });
        }
      }
      const sortedNameAndVisibilityAndZIndexes =
        screenComponentNameAndVisibilityAndZIndexes.sort(
          (a, b) => b.zIndex - a.zIndex
        );
      return sortedNameAndVisibilityAndZIndexes.length > 0
        ? sortedNameAndVisibilityAndZIndexes[0].name
        : '';
    },
    [screenComponentAppearances, screenComponentVisibilities]
  );

  useEffect(() => {
    const button = buttonRef.current;
    if (button) {
      const { x, y, width, height } = button.getBoundingClientRect();
      const zIndex = parseInt(
        window.getComputedStyle(button).zIndex || '0',
        10
      );
      dispatch(
        updateScreenComponentAppearance({
          componentName: 'button',
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
  }, []);

  useEffect(() => {
    const popup = popupRef.current;
    if (popup && screenComponentVisibilities.popup) {
      const { x, y, width, height } = popup.getBoundingClientRect();
      const zIndex = parseInt(window.getComputedStyle(popup).zIndex || '0', 10);
      dispatch(
        updateScreenComponentAppearance({
          componentName: 'popup',
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
  }, [screenComponentVisibilities.popup]);

  useEffect(() => {
    const hoveredComponentName = getScreenComponentNameFromPoint({
      x: cursorCoordX,
      y: cursorCoordY,
    });
    setHoveredScreenComponentName(hoveredComponentName);
  }, [
    cursorCoordX,
    cursorCoordY,
    screenComponentAppearances,
    screenComponentVisibilities,
  ]);

  useEffect(() => {
    setScreenComponentMouseActionStates((prev) => ({
      ...prev,
      ...screenComponentNameList.reduce((acc, name) => {
        acc[name] = initialComponentMouseActionState;
        return acc;
      }, {} as ScreenComponentMouseActionStates),
    }));
    setScreenComponentMouseActionStates((prev) => ({
      ...prev,
      ...screenComponentNameList.reduce(
        (result, name) => ({
          ...result,
          [name]: {
            ...prev[name],
            isHoverStarted: false,
            isHoverEnded: false,
          },
        }),
        {}
      ),
      [hoveredScreenComponentName]: {
        ...prev[hoveredScreenComponentName],
        isHoverStarted: true,
      },
    }));
    setTimeout(() => {
      setScreenComponentMouseActionStates((prev) => ({
        ...prev,
        [hoveredScreenComponentName]: {
          ...prev[hoveredScreenComponentName],
          isHoverStarted: false,
        },
      }));
    }, 1);
    if (hoveredScreenComponentName !== prevHoveredScreenComponentName) {
      setScreenComponentMouseActionStates((prev) => ({
        ...prev,
        [prevHoveredScreenComponentName]: {
          ...prev[prevHoveredScreenComponentName],
          isHoverEnded: true,
        },
      }));
      setTimeout(() => {
        setScreenComponentMouseActionStates((prev) => ({
          ...prev,
          [prevHoveredScreenComponentName]: {
            ...prev[prevHoveredScreenComponentName],
            isHoverEnded: false,
          },
        }));
      }, 1);
      setPrevHoveredScreenComponentName(hoveredScreenComponentName);
    }
    setScreenComponentMouseActionStates((prev) => ({
      ...prev,
      [hoveredScreenComponentName]: {
        ...prev[hoveredScreenComponentName],
        isShortClicked: mouseActionState.isShortClicked,
        isDblClicked: mouseActionState.isDblClicked,
        isLongClickStarted: mouseActionState.isLongClickStarted,
        isLongClickEnded: mouseActionState.isLongClickEnded,
      },
    }));
  }, [
    hoveredScreenComponentName,
    mouseActionState,
    prevHoveredScreenComponentName,
  ]);

  return (
    <Container>
      <Cursor x={cursorCoordX} y={cursorCoordY} />
      <Button
        ref={buttonRef}
        mouseActionState={screenComponentMouseActionStates.button}
        onVShortClick={() => {
          dispatch(
            updateScreenComponentVisibility({
              componentName: 'popup',
              visibility: true,
            })
          );
        }}
        onVDblClick={() => {
          console.log('button double clicked');
        }}
        onVLongClickStart={() => {
          console.log('button long click started');
        }}
        onVLongClickEnd={() => {
          console.log('button long click ended');
        }}
      />
      <Popup
        ref={popupRef}
        mouseActionState={screenComponentMouseActionStates.popup}
        isVisible={screenComponentVisibilities.popup}
      />
    </Container>
  );
};

export default memo(Screen);
