import { createSlice } from '@reduxjs/toolkit';
import {
  PartialPopupComponentAppearance,
  PopupComponentAppearances,
  PopupComponentName,
} from '../../types/data';
import { RootState } from '.';
import { popupComponentNameList } from '../../data';

export interface PopupState {
  popupComponentAppearances: PopupComponentAppearances;
}

const initialState: PopupState = {
  popupComponentAppearances: {
    '': {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      zIndex: 998,
      lastClickedCoord: { x: 0, y: 0 },
    },
    close: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      zIndex: 999,
      lastClickedCoord: { x: 0, y: 0 },
    },
    ok: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      zIndex: 999,
      lastClickedCoord: { x: 0, y: 0 },
    },
  },
};

export const popupSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    setPopupComponentAppearances(state, action) {
      state.popupComponentAppearances = action.payload;
    },
    updatePopupComponentAppearance(
      state,
      action: {
        payload: {
          componentName: PopupComponentName;
          appearance: PartialPopupComponentAppearance;
        };
      }
    ) {
      console.log('update popup component appearance');
      state.popupComponentAppearances = {
        ...state.popupComponentAppearances,
        ...{
          [action.payload.componentName]: {
            ...state.popupComponentAppearances[action.payload.componentName],
            ...action.payload.appearance,
          },
        },
      };
    },
    updateAllPopupComponentsLastClickedCoord(state) {
      console.log('update all popup components last clicked coord');
      state.popupComponentAppearances = {
        ...state.popupComponentAppearances,
        ...popupComponentNameList.reduce((result, componentName) => {
          result[componentName] = {
            ...state.popupComponentAppearances[componentName],
            lastClickedCoord: {
              x: state.popupComponentAppearances[componentName].x,
              y: state.popupComponentAppearances[componentName].y,
            },
          };
          return result;
        }, {} as PopupComponentAppearances),
      };
    },
    deltaUpdatePopupComponentAppearance(
      state,
      action: {
        payload: {
          componentName: PopupComponentName;
          deltaX: number;
          deltaY: number;
        };
      }
    ) {
      console.log('delta update popup component appearance');
      console.log('deltaX: ' + action.payload.deltaX);
      console.log('deltaY: ' + action.payload.deltaY);

      state.popupComponentAppearances = {
        ...state.popupComponentAppearances,
        ...{
          [action.payload.componentName]: {
            ...state.popupComponentAppearances[action.payload.componentName],
            ...{
              x:
                state.popupComponentAppearances[action.payload.componentName]
                  .lastClickedCoord.x + action.payload.deltaX,
              y:
                state.popupComponentAppearances[action.payload.componentName]
                  .lastClickedCoord.y + action.payload.deltaY,
            },
          },
        },
      };
    },
    deltaUpdateAllPopupComponentAppearances(
      state,
      action: {
        payload: {
          deltaX: number;
          deltaY: number;
        };
      }
    ) {
      console.log('delta update all popup component appearances');
      console.log('deltaX: ' + action.payload.deltaX);
      console.log('deltaY: ' + action.payload.deltaY);

      state.popupComponentAppearances = {
        ...state.popupComponentAppearances,
        ...popupComponentNameList.reduce((result, componentName) => {
          result[componentName] = {
            ...state.popupComponentAppearances[componentName],
            x:
              state.popupComponentAppearances[componentName].lastClickedCoord
                .x + action.payload.deltaX,
            y:
              state.popupComponentAppearances[componentName].lastClickedCoord
                .y + action.payload.deltaY,
          };
          return result;
        }, {} as PopupComponentAppearances),
      };
    },
  },
});

export const {
  setPopupComponentAppearances,
  updatePopupComponentAppearance,
  updateAllPopupComponentsLastClickedCoord,
  deltaUpdatePopupComponentAppearance,
  deltaUpdateAllPopupComponentAppearances,
} = popupSlice.actions;

export const selectPopupComponentAppearances = (state: RootState) =>
  state.popup.popupComponentAppearances;

export default popupSlice.reducer;
