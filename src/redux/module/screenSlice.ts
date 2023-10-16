import { createSlice } from '@reduxjs/toolkit';
import {
  Coord,
  PartialScreenComponentAppearance,
  ScreenComponentAppearances,
  ScreenComponentLastClickedCoords,
  ScreenComponentName,
  ScreenComponentVisibilities,
} from '../../types/data';
import { RootState } from '.';
import { screenComponentNameList } from '../../data';

export interface ScreenState {
  screenComponentAppearances: ScreenComponentAppearances;
  screenComponentVisibilities: ScreenComponentVisibilities;
  screenComponentLastClickedCoords: ScreenComponentLastClickedCoords;
}

const initialState: ScreenState = {
  screenComponentAppearances: {
    '': {
      x: 0,
      y: 0,
      width: 320,
      height: 240,
      zIndex: 0,
    },
    popup: {
      x: 0,
      y: 0,
      width: 160,
      height: 100,
      zIndex: 998,
    },
    modal: {
      x: 0,
      y: 0,
      width: 160,
      height: 100,
      zIndex: 101,
    },
    button: {
      x: 80,
      y: 80,
      width: 120,
      height: 100,
      zIndex: 10,
    },
  },
  screenComponentVisibilities: {
    '': true,
    popup: false,
    modal: false,
    button: true,
  },
  screenComponentLastClickedCoords: {
    '': {
      x: 0,
      y: 0,
    },
    popup: {
      x: 0,
      y: 0,
    },
    modal: {
      x: 0,
      y: 0,
    },
    button: {
      x: 0,
      y: 0,
    },
  },
};

export const screenSlice = createSlice({
  name: 'screen',
  initialState,
  reducers: {
    setScreenComponentAppearances(state, action) {
      state.screenComponentAppearances = action.payload;
    },
    updateScreenComponentAppearance(
      state,
      action: {
        payload: {
          componentName: ScreenComponentName;
          appearance: PartialScreenComponentAppearance;
        };
      }
    ) {
      state.screenComponentAppearances = {
        ...state.screenComponentAppearances,
        ...{
          [action.payload.componentName]: {
            ...state.screenComponentAppearances[action.payload.componentName],
            ...action.payload.appearance,
          },
        },
      };
    },
    deltaUpdateScreenComponentCoord(
      state,
      action: {
        payload: {
          componentName: ScreenComponentName;
          deltaX: number;
          deltaY: number;
        };
      }
    ) {
      state.screenComponentAppearances = {
        ...state.screenComponentAppearances,
        ...{
          [action.payload.componentName]: {
            ...state.screenComponentAppearances[action.payload.componentName],
            ...{
              x:
                state.screenComponentLastClickedCoords[
                  action.payload.componentName
                ].x + action.payload.deltaX,
              y:
                state.screenComponentLastClickedCoords[
                  action.payload.componentName
                ].y + action.payload.deltaY,
            },
          },
        },
      };
    },
    updateScreenComponentVisibility(
      state,
      action: {
        payload: {
          componentName: ScreenComponentName;
          visibility: boolean;
        };
      }
    ) {
      state.screenComponentVisibilities = {
        ...state.screenComponentVisibilities,
        ...{
          [action.payload.componentName]: action.payload.visibility,
        },
      };
    },
    updateScreenComponentLastClickedCoord(
      state,
      action: {
        payload: {
          componentName: ScreenComponentName;
          coord: Coord;
        };
      }
    ) {
      state.screenComponentLastClickedCoords = {
        ...state.screenComponentLastClickedCoords,
        [action.payload.componentName]: action.payload.coord,
      };
    },
    updateAllScreenComponentLastClickedCoords(state) {
      state.screenComponentLastClickedCoords = {
        ...state.screenComponentLastClickedCoords,
        ...screenComponentNameList.reduce((result, componentName) => {
          result[componentName] = {
            ...state.screenComponentLastClickedCoords[componentName],
            x: state.screenComponentAppearances[componentName].x,
            y: state.screenComponentAppearances[componentName].y,
          };
          return result;
        }, {} as ScreenComponentLastClickedCoords),
      };
    },
  },
});

export const {
  setScreenComponentAppearances,
  updateScreenComponentAppearance,
  deltaUpdateScreenComponentCoord,
  updateScreenComponentVisibility,
  updateScreenComponentLastClickedCoord,
  updateAllScreenComponentLastClickedCoords,
} = screenSlice.actions;

export const selectScreenComponentAppearances = (state: RootState) =>
  state.screen.screenComponentAppearances;
export const selectScreenComponentVisibilities = (state: RootState) =>
  state.screen.screenComponentVisibilities;
export const selectScreenComponentLastClickedCoords = (state: RootState) =>
  state.screen.screenComponentLastClickedCoords;

export default screenSlice.reducer;
