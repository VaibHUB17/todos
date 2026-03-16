const TodoItem = ({ todo, onToggle, onDelete, isToggling, isDeleting }) => {
  return (
    <li className={`todo-item ${todo.is_completed ? 'completed' : ''}`}>
      <label className="todo-content">
        <input
          type="checkbox"
          checked={todo.is_completed}
          onChange={() => onToggle(todo.id, todo.is_completed)}
          disabled={isToggling || isDeleting}
        />
        <span>{todo.title}</span>
      </label>

      <div className="todo-actions">
        <button
          type="button"
          className="secondary-btn"
          onClick={() => onToggle(todo.id, todo.is_completed)}
          disabled={isToggling || isDeleting}
        >
          {isToggling ? 'Saving...' : todo.is_completed ? 'Undo' : 'Complete'}
        </button>
        <button
          type="button"
          className="danger-btn"
          onClick={() => onDelete(todo.id)}
          disabled={isDeleting || isToggling}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </li>
  );
};

export default TodoItem;
