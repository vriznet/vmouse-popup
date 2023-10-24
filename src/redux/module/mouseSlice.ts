// #region : imports
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';
import { Coord } from '../../types/data';
import { MouseActionState } from '../../types/states';
// #endregion : imports

// #region : types
export interface MouseState {
  cursorX: number;
  cursorY: number;
  clickedCoord: Coord;
  mouseActionState: MouseActionState;
}
// #endregion : types

// #region : initialState
const initialState: MouseState = {
  cursorX: 10,
  cursorY: 10,
  clickedCoord: { x: 0, y: 0 },
  mouseActionState: {
    isClicking: false,
    isClickStarted: false,
    isClickEnded: false,
    isShortClicked: false,
    isDblClicked: false,
    isLongClickStarted: false,
    isLongClickEnded: false,
  },
};
// #endregion : initialState

// #region : reducers
export const mouseSlice = createSlice({
  name: 'mouse',
  initialState,
  reducers: {
    setCursorCoordX(state, action) {
      state.cursorX = action.payload;
    },
    setCursorCoordY(state, action) {
      state.cursorY = action.payload;
    },
    setClickedCoord(state, action) {
      state.clickedCoord = action.payload;
    },
    setMouseActionState(state, action: { payload: MouseActionState }) {
      state.mouseActionState = action.payload;
    },
    updateMouseActionState(
      state,
      action: { payload: Partial<MouseActionState> }
    ) {
      state.mouseActionState = {
        ...state.mouseActionState,
        ...action.payload,
      };
    },
  },
});
// #endregion : reducers

// #region : exports
// #region :: exporting actions
export const {
  setCursorCoordX,
  setCursorCoordY,
  setClickedCoord,
  setMouseActionState,
  updateMouseActionState,
} = mouseSlice.actions;
// #endregion :: exporting actions

// #region :: exporting selectors
export const selectCursorX = (state: RootState) => state.mouse.cursorX;
export const selectCursorY = (state: RootState) => state.mouse.cursorY;
export const selectClickedCoord = (state: RootState) =>
  state.mouse.clickedCoord;
export const selectMouseActionState = (state: RootState) =>
  state.mouse.mouseActionState;
// #endregion :: exporting selectors

export default mouseSlice.reducer;
// #endregion : exports
