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
  },
});

export const {
  setScreenComponentAppearances,
  updateScreenComponentAppearance,
  updateScreenComponentVisibility,
} = screenSlice.actions;

export const selectScreenComponentAppearances = (state: RootState) =>
  state.screen.screenComponentAppearances;
export const selectScreenComponentVisibilities = (state: RootState) =>
  state.screen.screenComponentVisibilities;

export default screenSlice.reducer;
