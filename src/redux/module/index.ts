import { combineReducers } from 'redux';
import mouseReducer from './mouseSlice';

export const rootReducer = combineReducers({
  mouse: mouseReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
