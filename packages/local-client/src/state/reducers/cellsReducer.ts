import produce from "immer";
import { randomId } from "../../utils";
import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell";

//Cell Logic explain please see 205. Update Cell Logic
interface CellState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce(
  (state: CellState = initialState, action: Action): CellState | void => {
    switch (action.type) {
      case ActionType.MOVE_CELL:
        const { direction } = action.payload;
        const index = state.order.findIndex((id) => action.payload.id === id);
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex > state.order.length - 1) {
          return state;
        }
        const swap = state.order[targetIndex];
        state.order[targetIndex] = state.order[index];
        state.order[index] = swap;
        return state;

      case ActionType.UPDATE_CELL:
        state.data[action.payload.id].content = action.payload.content;
        return state;

      case ActionType.DELETE_CELL:
        if (!(action.payload in state.data)) {
          return state;
        }
        state.order = state.order.filter((id) => action.payload !== id);
        delete state.data[action.payload];
        return state;

      case ActionType.INSERT_CELL_AFTER:
        const id = randomId();
        const cell: Cell = {
          content: "",
          type: action.payload.cellType,
          id,
        };
        state.data[cell.id] = cell;

        let foundIdx = state.order.findIndex((id) => action.payload.id === id);
        if (foundIdx < 0) {
          state.order.unshift(cell.id);
        } else {
          state.order.splice(foundIdx + 1, 0, cell.id);
        }
        return state;
      case ActionType.FETCH_CELLS:
        state.loading = true;
        state.error = null;
        return state;
      case ActionType.FETCH_CELLS_COMPLETE:
        state.order = action.payload.map((cell) => cell.id);
        state.data = action.payload.reduce((acc, cell) => {
          return { ...acc, [cell.id]: cell };
        }, {});
        console.log('state.data', state.data)
        // state.data= action.payload.reduce((acc, cell) => {
        //   acc[cell.id] = cell
        //   return acc
        // }, {} as CellState['data'])
        return state;
      case ActionType.FETCH_CELLS_ERROR:
        state.loading = false;
        state.error = action.payload;
        return state;
      case ActionType.SAVE_CELLS_ERROR:
        state.error = action.payload;
        return state;
      default:
        return state;
    }
  },
  initialState
);

export default reducer;
