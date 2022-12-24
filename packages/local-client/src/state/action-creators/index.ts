import { ActionType } from "../action-types";
import { Dispatch } from "redux";
import {
  Action,
  MoveCellAction,
  DeleteCellAction,
  InsertCellAfterAction,
  UpdateCellAction,
  Direction,
} from "../actions";
import BundlerService from "../../bundler";
import axios from "axios";
import { Cell, CellTypes } from "../cell";
import { RootState } from "../reducers";

export const moveCell = (id: string, direction: Direction): MoveCellAction => {
  return {
    type: ActionType.MOVE_CELL,
    payload: {
      id,
      direction,
    },
  };
};

export const deleteCell = (id: string): DeleteCellAction => {
  return {
    type: ActionType.DELETE_CELL,
    payload: id,
  };
};

export const updateCell = (id: string, content: string): UpdateCellAction => {
  return {
    type: ActionType.UPDATE_CELL,
    payload: {
      id,
      content,
    },
  };
};

export const insertCellAfter = (
  id: string | null,
  cellType: CellTypes
): InsertCellAfterAction => {
  return {
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
      id,
      cellType,
    },
  };
};

export const createBundle =
  (cellId: string, input: string) => async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.BUNDLE_START,
      payload: { cellId },
    });
    try {
      const result = await BundlerService(input);

      dispatch({
        type: ActionType.BUNDLE_COMPLETE,
        payload: {
          cellId,
          bundle: result,
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
    }
  };

export const fetchCells = () => async (dispatch: Dispatch<Action>) => {
  dispatch({
    type: ActionType.FETCH_CELLS,
  });

  try {
    const { data }: { data: Cell[] } = await axios.get("/cells");

    dispatch({
      type: ActionType.FETCH_CELLS_COMPLETE,
      payload: data,
    });
  } catch (err) {
    if (err instanceof Error) {
      dispatch({
        type: ActionType.FETCH_CELLS_ERROR,
        payload: err.message,
      });
    }
  }
};

export const saveCells =
  () => async (dispatch: Dispatch<Action>, getState: () => RootState) => {

    const { cells: { data, order}} = getState()
    const cells = order.map(id => data[id]) //an array of object
    try {
      await axios.post("/cells", {cells});

    }catch(err) {
      if (err instanceof Error) {
        dispatch({
          type: ActionType.SAVE_CELLS_ERROR,
          payload: err.message
        })
      }
    }
  };
