import { combineReducers } from 'redux';
import mouseReducer from './mouseSlice';
import screenReducer from './screenSlice';

export const rootReducer = combineReducers({
  mouse: mouseReducer,
  screen: screenReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
