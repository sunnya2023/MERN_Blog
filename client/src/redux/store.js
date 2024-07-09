import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import themeReducer from "./theme/themeSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
});

//// persist 설정
const persistConfig = {
  key: "root", // 저장 공간의 key 값
  storage, // 저장 공간으로 로컬 스토리지를 사용
  version: 1,
};
//persistConfig와 rootReducer를 인자로 받아서, 상태가 지속적으로 저장되도록 하는 리듀서를 생성
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
