import { useEffect } from 'react';
import { ComponentMouseActionState } from '../types/states';
import { ActionMap } from '../types/data';

const useVMouseAction = (
  mouseActionState: ComponentMouseActionState,
  actionMap: ActionMap
) => {
  useEffect(() => {
    let actionState: keyof ComponentMouseActionState;
    for (actionState in mouseActionState) {
      if (mouseActionState[actionState]) {
        actionMap[actionState]();
      }
    }
  }, [mouseActionState]);
};

export default useVMouseAction;
