import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { styled } from 'styled-components';
import { setCursorCoordX, setCursorCoordY } from '../redux/module/mouseSlice';

const TrackpadSC = styled.div`
  width: 320px;
  height: 240px;
  border: 1px solid #000;
`;

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

export const inrange = (v: number, min: number, max: number) => {
  if (v < min) return min;
  if (v > max) return max;
  return v;
};

const Trackpad = () => {
  const trackpadRef = useRef<HTMLDivElement>(null);

  const [ongoingTouches, setOngoingTouches] = useState<any[]>([]);
  const [currentCursorCoordX, setCurrentCursorCoordX] = useState<number>(0);
  const [currentCursorCoordY, setCurrentCursorCoordY] = useState<number>(0);

  const dispatch = useDispatch();

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

  useEffect(() => {
    dispatch(setCursorCoordX(currentCursorCoordX));
  }, [currentCursorCoordX]);

  useEffect(() => {
    dispatch(setCursorCoordY(currentCursorCoordY));
  }, [currentCursorCoordY]);

  return <TrackpadSC id="trackpad" ref={trackpadRef} />;
};

export default memo(Trackpad);
