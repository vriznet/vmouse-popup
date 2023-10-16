import { createSlice } from '@reduxjs/toolkit';
import {
  PartialPopupComponentAppearance,
  PopupComponentAppearances,
  PopupComponentLastClickedCoords,
  PopupComponentName,
} from '../../types/data';
import { RootState } from '.';
import { popupComponentNameList } from '../../data';

export interface PopupState {
  popupComponentAppearances: PopupComponentAppearances;
  popupComponentLastClickedCoords: PopupComponentLastClickedCoords;
}

const initialState: PopupState = {
  popupComponentAppearances: {
    '': {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      zIndex: 998,
    },
    close: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      zIndex: 999,
    },
    ok: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      zIndex: 999,
    },
    headerBar: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      zIndex: 999,
    },
  },
  popupComponentLastClickedCoords: {
    '': {
      x: 0,
      y: 0,
    },
    close: {
      x: 0,
      y: 0,
    },
    ok: {
      x: 0,
      y: 0,
    },
    headerBar: {
      x: 0,
      y: 0,
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
    updatePopupComponentLastClickedCoord(
      state,
      action: {
        payload: {
          componentName: PopupComponentName;
          coord: {
            x: number;
            y: number;
          };
        };
      }
    ) {
      state.popupComponentLastClickedCoords = {
        ...state.popupComponentLastClickedCoords,
        [action.payload.componentName]: action.payload.coord,
      };
    },
    updateAllPopupComponentsLastClickedCoord(state) {
      state.popupComponentLastClickedCoords = {
        ...popupComponentNameList.reduce((result, componentName) => {
          result[componentName] = {
            x: state.popupComponentAppearances[componentName].x,
            y: state.popupComponentAppearances[componentName].y,
          };
          return result;
        }, {} as PopupComponentLastClickedCoords),
      };
    },
    deltaUpdatePopupComponentCoord(
      state,
      action: {
        payload: {
          componentName: PopupComponentName;
          deltaX: number;
          deltaY: number;
        };
      }
    ) {
      state.popupComponentAppearances = {
        ...state.popupComponentAppearances,
        ...{
          [action.payload.componentName]: {
            ...state.popupComponentAppearances[action.payload.componentName],
            ...{
              x:
                state.popupComponentLastClickedCoords[
                  action.payload.componentName
                ].x + action.payload.deltaX,
              y:
                state.popupComponentLastClickedCoords[
                  action.payload.componentName
                ].y + action.payload.deltaY,
            },
          },
        },
      };
    },
    deltaUpdateAllPopupComponentCoord(
      state,
      action: {
        payload: {
          deltaX: number;
          deltaY: number;
        };
      }
    ) {
      state.popupComponentAppearances = {
        ...state.popupComponentAppearances,
        ...popupComponentNameList.reduce((result, componentName) => {
          result[componentName] = {
            ...state.popupComponentAppearances[componentName],
            x:
              state.popupComponentLastClickedCoords[componentName].x +
              action.payload.deltaX,
            y:
              state.popupComponentLastClickedCoords[componentName].y +
              action.payload.deltaY,
          };
          return result;
        }, {} as PopupComponentAppearances),
      };
      console.log(state.popupComponentAppearances);
    },
  },
});

export const {
  setPopupComponentAppearances,
  updatePopupComponentAppearance,
  updateAllPopupComponentsLastClickedCoord,
  deltaUpdatePopupComponentCoord,
  deltaUpdateAllPopupComponentCoord,
} = popupSlice.actions;

export const selectPopupComponentAppearances = (state: RootState) =>
  state.popup.popupComponentAppearances;

export default popupSlice.reducer;
