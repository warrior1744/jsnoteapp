import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";
import { persistMiddleware } from "./middlewares/persistMiddleware";
// import { Action } from "./actions";
// import { ActionType } from "./action-types";

export const store = createStore(
  reducers,
  {},
  applyMiddleware(persistMiddleware, thunk)
);

// store.dispatch({
//   type: ActionType.INSERT_CELL_AFTER,
//   payload: {
//     id: null,
//     cellType: "code",
//   },
// });

// store.dispatch({
//   type: ActionType.INSERT_CELL_AFTER,
//   payload: {
//     id: null,
//     cellType: "text",
//   },
// });

console.log("store.getState() -> ", store.getState());
