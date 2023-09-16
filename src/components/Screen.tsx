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
  updateScreenComponentAppearance,
} from '../types/screenSlice';
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

  const mouseActionState = useSelector(selectMouseActionState);

  const buttonRef = useRef<HTMLDivElement>(null);

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
        if (
          appearanceData.x + appearanceData.width >= point.x &&
          appearanceData.y + appearanceData.height >= point.y &&
          appearanceData.x < point.x &&
          appearanceData.y < point.y &&
          appearanceData.isVisible
        ) {
          screenComponentNameAndVisibilityAndZIndexes.push({
            name: key,
            isVisible: appearanceData.isVisible,
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
    [screenComponentAppearances]
  );

  useEffect(() => {
    const button = buttonRef.current;
    if (button) {
      const { x, y, width, height } = button.getBoundingClientRect();
      const zIndex = parseInt(
        window.getComputedStyle(button).zIndex || '0',
        10
      );
      const displayStyle = window.getComputedStyle(button).display;
      dispatch(
        updateScreenComponentAppearance({
          componentName: 'button',
          appearance: {
            x,
            y,
            width,
            height,
            isVisible: displayStyle && displayStyle !== 'none' ? true : false,
            zIndex,
          },
        })
      );
    }
  }, []);

  useEffect(() => {
    const hoveredComponentName = getScreenComponentNameFromPoint({
      x: cursorCoordX,
      y: cursorCoordY,
    });
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
      [hoveredComponentName]: {
        ...prev[hoveredComponentName],
        isHoverStarted: true,
      },
    }));
    setTimeout(() => {
      setScreenComponentMouseActionStates((prev) => ({
        ...prev,
        [hoveredComponentName]: {
          ...prev[hoveredComponentName],
          isHoverStarted: false,
        },
      }));
    }, 1);
    setHoveredScreenComponentName(hoveredComponentName);
  }, [cursorCoordX, cursorCoordY, screenComponentAppearances]);

  useEffect(() => {
    setScreenComponentMouseActionStates((prev) => ({
      ...prev,
      ...screenComponentNameList.reduce((acc, name) => {
        acc[name] = initialComponentMouseActionState;
        return acc;
      }, {} as ScreenComponentMouseActionStates),
    }));
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
          console.log('button short clicked');
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
    </Container>
  );
};

export default memo(Screen);
