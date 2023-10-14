import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';
import { Coord } from '../../types/data';
import { MouseActionState } from '../../types/states';

export interface MouseState {
  cursorX: number;
  cursorY: number;
  clickedCoord: Coord;
  mouseActionState: MouseActionState;
}

const initialState: MouseState = {
  cursorX: 10,
  cursorY: 10,
  clickedCoord: { x: 0, y: 0 },
  mouseActionState: {
    isClicking: false,
    isClickStarted: false,
    isShortClicked: false,
    isDblClicked: false,
    isLongClickStarted: false,
    isLongClickEnded: false,
  },
};

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
      console.log('set clicked coord');
      console.log(action.payload);
      state.clickedCoord = action.payload;
    },
    setMouseActionState(state, action: { payload: MouseActionState }) {
      state.mouseActionState = action.payload;
    },
    updateMouseActionState(
      state,
      action: { payload: Partial<MouseActionState> }
    ) {
      console.log('update mouse action state');
      console.log('isClicking:');
      console.log(state.mouseActionState.isClicking);
      console.log('isClickStarted:');
      console.log(state.mouseActionState.isClickStarted);
      state.mouseActionState = {
        ...state.mouseActionState,
        ...action.payload,
      };
    },
  },
});

export const {
  setCursorCoordX,
  setCursorCoordY,
  setClickedCoord,
  setMouseActionState,
  updateMouseActionState,
} = mouseSlice.actions;

export const selectCursorX = (state: RootState) => state.mouse.cursorX;
export const selectCursorY = (state: RootState) => state.mouse.cursorY;
export const selectClickedCoord = (state: RootState) =>
  state.mouse.clickedCoord;
export const selectMouseActionState = (state: RootState) =>
  state.mouse.mouseActionState;

export default mouseSlice.reducer;
