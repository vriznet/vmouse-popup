import { useEffect } from 'react';
import { ComponentMouseActionState } from '../types/states';
import { ActionMap } from '../types/data';
import { useDispatch } from 'react-redux';
import { updateMouseActionState } from '../redux/module/mouseSlice';

const useVMouseAction = (
  mouseActionState: ComponentMouseActionState,
  actionMap: ActionMap
) => {
  const dispatch = useDispatch();

  const willResetActionStates = [
    'isShortClicked',
    'isDblClicked',
    'isLongClickEnded',
  ];

  useEffect(() => {
    let actionState: keyof ComponentMouseActionState;
    for (actionState in mouseActionState) {
      if (mouseActionState[actionState]) {
        actionMap[actionState]();
        if (willResetActionStates.includes(actionState)) {
          dispatch(
            updateMouseActionState({
              [actionState]: false,
            })
          );
        }
      }
    }
  }, [mouseActionState]);
};

export default useVMouseAction;
