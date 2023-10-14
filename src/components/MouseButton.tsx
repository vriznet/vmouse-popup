/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from 'react-redux';
import { styled } from 'styled-components';
import {
  selectCursorX,
  selectCursorY,
  selectMouseActionState,
  setClickedCoord,
  updateMouseActionState,
} from '../redux/module/mouseSlice';
import { memo, useCallback, useEffect, useState } from 'react';

const MouseButtonSC = styled.div`
  width: 100%;
  height: 40px;
  border: 1px solid #000;
`;

const MouseButton = () => {
  const [longTouchTimeoutId, setLongTouchTimeoutId] = useState<
    NodeJS.Timeout | undefined
  >(undefined);
  const [doubleTouchTimeoutId, setDoubleTouchTimeoutId] = useState<
    NodeJS.Timeout | undefined
  >(undefined);
  const [isInDoubleClickInterval, setIsInDoubleClickInterval] =
    useState<boolean>(false);

  const dispatch = useDispatch();

  const cursorX = useSelector(selectCursorX);
  const cursorY = useSelector(selectCursorY);

  const mouseActionState = useSelector(selectMouseActionState);

  const handleMouseButtonTouchStart = useCallback(
    (event: TouchEvent) => {
      event.preventDefault();

      dispatch(
        updateMouseActionState({
          isClickStarted: true,
          isClicking: true,
          isLongClickStarted: false,
        })
      );

      dispatch(
        setClickedCoord({
          x: cursorX,
          y: cursorY,
        })
      );

      clearTimeout(longTouchTimeoutId);

      const id = setTimeout(() => {
        dispatch(updateMouseActionState({ isLongClickStarted: true }));
      }, 300);
      setLongTouchTimeoutId(id);
    },
    [longTouchTimeoutId, cursorX, cursorY]
  );

  const handleMouseButtonTouchEnd = useCallback(
    (event: TouchEvent) => {
      event.preventDefault();

      dispatch(updateMouseActionState({ isClicking: false }));

      clearTimeout(longTouchTimeoutId);
      clearTimeout(doubleTouchTimeoutId);

      const id = setTimeout(() => {
        setIsInDoubleClickInterval(false);
      }, 200);

      setDoubleTouchTimeoutId(id);

      if (isInDoubleClickInterval) {
        dispatch(
          updateMouseActionState({
            isDblClicked: true,
          })
        );
        if (mouseActionState.isLongClickStarted) {
          dispatch(
            updateMouseActionState({
              isLongClickEnded: true,
              isLongClickStarted: false,
            })
          );
        }
        setIsInDoubleClickInterval(false);
      } else {
        setIsInDoubleClickInterval(true);
        dispatch(updateMouseActionState({ isDblClicked: false }));
        if (mouseActionState.isLongClickStarted) {
          dispatch(
            updateMouseActionState({
              isLongClickEnded: true,
              isLongClickStarted: false,
            })
          );
        } else {
          dispatch(
            updateMouseActionState({
              isShortClicked: true,
            })
          );
        }
      }
    },
    [
      mouseActionState.isLongClickStarted,
      longTouchTimeoutId,
      doubleTouchTimeoutId,
      isInDoubleClickInterval,
    ]
  );

  useEffect(() => {
    return () => {
      clearTimeout(longTouchTimeoutId);
      clearTimeout(doubleTouchTimeoutId);
    };
  }, []);

  useEffect(() => {
    const mouseBtn = document.getElementById('mouse-btn');
    if (mouseBtn) {
      mouseBtn.addEventListener('touchstart', handleMouseButtonTouchStart);
      mouseBtn.addEventListener('touchend', handleMouseButtonTouchEnd);
    }

    return () => {
      if (mouseBtn) {
        mouseBtn.removeEventListener('touchstart', handleMouseButtonTouchStart);
        mouseBtn.removeEventListener('touchend', handleMouseButtonTouchEnd);
      }
    };
  }, [handleMouseButtonTouchStart, handleMouseButtonTouchEnd]);

  useEffect(() => {
    if (mouseActionState.isClickStarted) {
      setTimeout(() => {
        dispatch(
          updateMouseActionState({
            isClickStarted: false,
          })
        );
      }, 1);
    }
    if (mouseActionState.isShortClicked) {
      setTimeout(() => {
        dispatch(
          updateMouseActionState({
            isShortClicked: false,
          })
        );
      }, 1);
    }
    if (mouseActionState.isDblClicked) {
      setTimeout(() => {
        dispatch(
          updateMouseActionState({
            isDblClicked: false,
          })
        );
      }, 1);
    }
    if (mouseActionState.isLongClickEnded) {
      setTimeout(() => {
        dispatch(
          updateMouseActionState({
            isLongClickEnded: false,
          })
        );
      }, 1);
    }
  }, [mouseActionState]);

  return <MouseButtonSC id="mouse-btn" />;
};

export default memo(MouseButton);
