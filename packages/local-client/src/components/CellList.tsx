import "./styling/cell-list.css";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { Fragment, useEffect } from "react";
import AddCell from "./AddCell";
import CellListItem from "./CellListItem";
import { useActions } from "../hooks/useActions";

const CellList = () => {
  const cells = useTypedSelector(({ cells: { order, data } }) => {
    return order.map((id) => data[id]);
  });

  const { fetchCells} = useActions()

  useEffect(() => {
    fetchCells()
  }, [])

  const renderedCells = cells.map((cell) => {
    return (
      <Fragment key={cell.id}>
        <CellListItem key={cell.id} cell={cell} />
        <AddCell previousCellId={cell.id} />
      </Fragment>
    );
  });

  return (
    <div className="cell-list">
      <AddCell forceVisible={cells.length === 0} previousCellId={null} />
      {renderedCells}
    </div>
  );
};

export default CellList;
