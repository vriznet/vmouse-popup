import { createSlice } from '@reduxjs/toolkit';
import {
  PartialScreenComponentAppearance,
  ScreenComponentAppearances,
  ScreenComponentName,
  ScreenComponentVisibilities,
} from '../../types/data';
import { RootState } from '.';

export interface ScreenState {
  screenComponentAppearances: ScreenComponentAppearances;
  screenComponentVisibilities: ScreenComponentVisibilities;
}

const initialState: ScreenState = {
  screenComponentAppearances: {
    '': {
      x: 0,
      y: 0,
      width: 320,
      height: 240,
      zIndex: 0,
      lastClickedCoord: { x: 0, y: 0 },
    },
    popup: {
      x: 0,
      y: 0,
      width: 160,
      height: 100,
      zIndex: 998,
      lastClickedCoord: { x: 0, y: 0 },
    },
    modal: {
      x: 0,
      y: 0,
      width: 160,
      height: 100,
      zIndex: 101,
      lastClickedCoord: { x: 0, y: 0 },
    },
    button: {
      x: 80,
      y: 80,
      width: 120,
      height: 100,
      zIndex: 10,
      lastClickedCoord: { x: 0, y: 0 },
    },
  },
  screenComponentVisibilities: {
    '': true,
    popup: false,
    modal: false,
    button: true,
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
      console.log('update screen component appearance');
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
      console.log('delta update screen component coord');
      console.log('deltaX: ' + action.payload.deltaX);
      console.log('deltaY: ' + action.payload.deltaY);

      state.screenComponentAppearances = {
        ...state.screenComponentAppearances,
        ...{
          [action.payload.componentName]: {
            ...state.screenComponentAppearances[action.payload.componentName],
            ...{
              x:
                state.screenComponentAppearances[action.payload.componentName]
                  .lastClickedCoord.x + action.payload.deltaX,
              y:
                state.screenComponentAppearances[action.payload.componentName]
                  .lastClickedCoord.y + action.payload.deltaY,
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
      console.log('update screen component visibility');
      state.screenComponentVisibilities = {
        ...state.screenComponentVisibilities,
        ...{
          [action.payload.componentName]: action.payload.visibility,
        },
      };
    },
  },
});

export const {
  setScreenComponentAppearances,
  updateScreenComponentAppearance,
  deltaUpdateScreenComponentCoord,
  updateScreenComponentVisibility,
} = screenSlice.actions;

export const selectScreenComponentAppearances = (state: RootState) =>
  state.screen.screenComponentAppearances;
export const selectScreenComponentVisibilities = (state: RootState) =>
  state.screen.screenComponentVisibilities;

export default screenSlice.reducer;
