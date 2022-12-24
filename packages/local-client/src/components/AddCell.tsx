import "./styling/add-cell.css";
import { useActions } from "../hooks/useActions";

interface AddCellProps {
  previousCellId: string | null;
  forceVisible?: boolean;
}

const AddCell = ({ previousCellId, forceVisible }: AddCellProps) => {
  const { insertCellAfter } = useActions();

  return (
    <div className={`add-cell ${forceVisible && "visible"}`}>
      <div className="add-cell-buttons">
        <button
          className="button is-primary is-rounded is-small"
          onClick={() => insertCellAfter(previousCellId, "code")}
        >
          <span className="icon is-small">
            <i className="fas fa-plus" />
          </span>
          <span>Code</span>
        </button>

        <button
          className="button is-primary is-rounded is-small"
          onClick={() => insertCellAfter(previousCellId, "text")}
        >
          <span className="icon is-small">
            <i className="fas fa-plus" />
          </span>
          <span>Text</span>
        </button>
      </div>
      <div className="divider"></div>
    </div>
  );
};

export default AddCell;
