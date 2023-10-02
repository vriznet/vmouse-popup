import { combineReducers } from 'redux';
import mouseReducer from './mouseSlice';
import screenReducer from './screenSlice';
import popupReducer from './popupSlice';

export const rootReducer = combineReducers({
  mouse: mouseReducer,
  screen: screenReducer,
  popup: popupReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
