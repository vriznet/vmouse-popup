/* eslint-disable react-hooks/exhaustive-deps */
// #region : imports
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { styled } from 'styled-components';
import { setCursorCoordX, setCursorCoordY } from '../redux/module/mouseSlice';
import { inrange } from '../utils';
// #endregion : imports

// #region : styled components
const TrackpadSC = styled.div`
  width: 320px;
  height: 240px;
  border: 1px solid #000;
`;
// #endregion : styled components

// #region : functions
const copyTouch = ({ identifier, pageX, pageY }: any) => ({
  identifier,
  pageX,
  pageY,
});

const ongoingTouchIndexById = (ongoingTouches: any[], idToFind: number) => {
  for (let i = 0; i < ongoingTouches.length; i++) {
    const id = ongoingTouches[i].identifier;

    if (id === idToFind) {
      return i;
    }
  }

  return -1;
};
// #endregion : functions

const Trackpad = () => {
  // #region : states
  const [ongoingTouches, setOngoingTouches] = useState<any[]>([]);
  const [currentCursorCoordX, setCurrentCursorCoordX] = useState<number>(0);
  const [currentCursorCoordY, setCurrentCursorCoordY] = useState<number>(0);
  // #endregion : states

  const dispatch = useDispatch();

  // #region : refs
  const trackpadRef = useRef<HTMLDivElement>(null);
  // #endregion : refs

  // #region : handlers
  const handlePadTouchStart = useCallback(
    (event: TouchEvent) => {
      event.preventDefault();
      const touches = event.changedTouches;
      for (let i = 0; i < touches.length; i++) {
        setOngoingTouches((prev) => [...prev, touches[i]]);
      }
    },
    [ongoingTouches, setOngoingTouches]
  );

  const handlePadTouchMove = useCallback(
    (event: TouchEvent) => {
      event.preventDefault();
      const touches = event.changedTouches;
      for (let i = 0; i < touches.length; i++) {
        const idx = ongoingTouchIndexById(
          ongoingTouches,
          touches[i].identifier
        );
        if (idx >= 0) {
          if (
            ongoingTouches[idx] !== null &&
            ongoingTouches[idx] !== undefined
          ) {
            const touch = ongoingTouches[idx];
            if (touch !== null) {
              let dx = (touches[i].pageX - touch.pageX) * 1.5;
              let dy = (touches[i].pageY - touch.pageY) * 1.2;
              setOngoingTouches((prev) => {
                const newOngoingTouches = [...prev];
                newOngoingTouches.splice(idx, 1, copyTouch(touches[i]));
                return newOngoingTouches;
              });

              setCurrentCursorCoordX((prev) => {
                const newCoordX = inrange(prev + dx, 2, 320 - 2);
                return newCoordX;
              });
              setCurrentCursorCoordY((prev) => {
                const newCoordY = inrange(prev + dy, 2, 240 - 2);
                return newCoordY;
              });
            }
          }
        } else {
          console.log(`can't figure out which touch to continue`);
        }
      }
    },
    [ongoingTouches, setOngoingTouches]
  );

  const handlePadTouchEnd = useCallback(
    (event: TouchEvent) => {
      const touches = event.changedTouches;

      for (let i = 0; i < touches.length; i++) {
        const idx = ongoingTouchIndexById(
          ongoingTouches,
          touches[i].identifier
        );

        if (idx >= 0) {
          setOngoingTouches((prev) => {
            const newOngoingTouches = [...prev];
            newOngoingTouches.splice(idx, 1);
            return newOngoingTouches;
          });
        } else {
          console.log(`can't figure out which touch to end`);
        }
      }
    },
    [ongoingTouches, setOngoingTouches]
  );
  // #endregion : handlers

  // #region : effects
  // #region :: add event listeners - ongoingTouches dependency
  useEffect(() => {
    const trackpad = trackpadRef.current;

    if (trackpad) {
      trackpad.addEventListener('touchstart', handlePadTouchStart);
      trackpad.addEventListener('touchmove', handlePadTouchMove);
      trackpad.addEventListener('touchend', handlePadTouchEnd);
    }

    return () => {
      if (trackpad) {
        trackpad.removeEventListener('touchstart', handlePadTouchStart);
        trackpad.removeEventListener('touchmove', handlePadTouchMove);
        trackpad.removeEventListener('touchend', handlePadTouchEnd);
      }
    };
  }, [ongoingTouches, setOngoingTouches]);
  // #endregion :: add event listeners - ongoingTouches dependency

  // #region :: update cursor coord x, y
  useEffect(() => {
    dispatch(setCursorCoordX(currentCursorCoordX));
  }, [currentCursorCoordX]);

  useEffect(() => {
    dispatch(setCursorCoordY(currentCursorCoordY));
  }, [currentCursorCoordY]);
  // #endregion :: update cursor coord x, y
  // #endregion : effects

  return <TrackpadSC id="trackpad" ref={trackpadRef} />;
};

export default memo(Trackpad);
