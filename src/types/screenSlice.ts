import { createSlice } from '@reduxjs/toolkit';
import {
  PartialScreenComponentAppearance,
  ScreenComponentAppearances,
  ScreenComponentName,
} from './data';
import { RootState } from '../redux/module';

export interface ScreenState {
  screenComponentAppearances: ScreenComponentAppearances;
}

const initialState: ScreenState = {
  screenComponentAppearances: {
    '': {
      x: 0,
      y: 0,
      width: 320,
      height: 240,
      isVisible: false,
      zIndex: 0,
    },
    popup: {
      x: 40,
      y: 40,
      width: 160,
      height: 100,
      isVisible: false,
      zIndex: 100,
    },
    modal: {
      x: 40,
      y: 40,
      width: 160,
      height: 100,
      isVisible: false,
      zIndex: 101,
    },
    button: {
      x: 80,
      y: 80,
      width: 120,
      height: 100,
      isVisible: true,
      zIndex: 10,
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
  },
});

export const {
  setScreenComponentAppearances,
  updateScreenComponentAppearance,
} = screenSlice.actions;

export const selectScreenComponentAppearances = (state: RootState) =>
  state.screen.screenComponentAppearances;

export default screenSlice.reducer;
