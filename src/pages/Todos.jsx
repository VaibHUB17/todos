import { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useSignOut, useUserData } from '@nhost/react';
import TodoItem from '../components/TodoItem';

// Query - Get all todos
const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      title
      is_completed
      created_at
    }
  }
`;

// Mutation - Add todo
const ADD_TODO = gql`
  mutation AddTodo($title: String!) {
    insert_todos_one(object: { title: $title, is_completed: false }) {
      id
      title
      is_completed
    }
  }
`;

// Mutation - Toggle complete
const TOGGLE_COMPLETE = gql`
  mutation ToggleComplete($id: uuid!, $is_completed: Boolean!) {
    update_todos_by_pk(
      pk_columns: { id: $id }
      _set: { is_completed: $is_completed }
    ) {
      id
      is_completed
    }
  }
`;

// Mutation - Delete todo
const DELETE_TODO = gql`
  mutation DeleteTodo($id: uuid!) {
    delete_todos_by_pk(id: $id) {
      id
    }
  }
`;

const Todos = () => {
  const navigate = useNavigate();
  const user = useUserData();
  const { signOut, isLoading: isSigningOut } = useSignOut();

  const [title, setTitle] = useState('');
  const [activeToggleId, setActiveToggleId] = useState(null);
  const [activeDeleteId, setActiveDeleteId] = useState(null);

  const { data, loading, error } = useQuery(GET_TODOS);

  const [addTodo, { loading: addingTodo }] = useMutation(ADD_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
    awaitRefetchQueries: true
  });

  const [toggleComplete] = useMutation(TOGGLE_COMPLETE, {
    refetchQueries: [{ query: GET_TODOS }],
    awaitRefetchQueries: true
  });

  const [deleteTodo] = useMutation(DELETE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
    awaitRefetchQueries: true
  });

  const handleAddTodo = async (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    await addTodo({
      variables: { title: trimmedTitle }
    });

    setTitle('');
  };

  const handleToggle = async (id, isCompleted) => {
    setActiveToggleId(id);

    try {
      await toggleComplete({
        variables: {
          id,
          is_completed: !isCompleted
        }
      });
    } finally {
      setActiveToggleId(null);
    }
  };

  const handleDelete = async (id) => {
    setActiveDeleteId(id);

    try {
      await deleteTodo({
        variables: { id }
      });
    } finally {
      setActiveDeleteId(null);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="page-shell">
        <div className="card">
          <p>Loading todos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell">
        <div className="card">
          <h2>Unable to fetch todos</h2>
          <p className="error-text">{error.message}</p>
        </div>
      </div>
    );
  }

  const todos = data?.todos ?? [];

  return (
    <div className="page-shell">
      <div className="card todos-card">
        <header className="todos-header">
          <div>
            <h1>Your Todos</h1>
            <p className="muted">Logged in as {user?.email || 'user'}</p>
          </div>

          <button
            type="button"
            className="secondary-btn"
            onClick={handleLogout}
            disabled={isSigningOut}
          >
            {isSigningOut ? 'Logging out...' : 'Logout'}
          </button>
        </header>

        <form onSubmit={handleAddTodo} className="add-todo-form">
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Add a new todo"
            maxLength={200}
          />
          <button type="submit" disabled={addingTodo || !title.trim()}>
            {addingTodo ? 'Adding...' : 'Add Todo'}
          </button>
        </form>

        {todos.length === 0 ? (
          <p className="empty-state">No todos yet. Add your first one above.</p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
                isToggling={activeToggleId === todo.id}
                isDeleting={activeDeleteId === todo.id}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Todos;
