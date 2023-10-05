import { createSlice } from '@reduxjs/toolkit';
import {
  PartialPopupComponentAppearance,
  PopupComponentAppearances,
  PopupComponentName,
} from '../../types/data';
import { RootState } from '.';

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
  },
});

export const { setPopupComponentAppearances, updatePopupComponentAppearance } =
  popupSlice.actions;

export const selectPopupComponentAppearances = (state: RootState) =>
  state.popup.popupComponentAppearances;

export default popupSlice.reducer;
