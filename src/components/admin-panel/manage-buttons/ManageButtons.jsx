import "./manage-buttons.css";

const ManageButtons = ({
  confirmValue,
  deleteValue,
  confirmHandler,
  deleteHandler,
}) => {
  return (
    <div className="manage-btns-container">
      {confirmValue && (
        <button className="confirm-btn" onClick={confirmHandler}>
          {confirmValue}
        </button>
      )}
      {deleteValue && (
        <button className="delete-btn" onClick={deleteHandler}>
          {deleteValue}
        </button>
      )}
    </div>
  );
};

export default ManageButtons;
