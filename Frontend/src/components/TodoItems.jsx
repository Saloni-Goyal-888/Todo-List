import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

function TodoItems({ token }) {
  const { listId } = useParams()
  const [todoList, setTodoList] = useState(null)
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)
  const [todoTitle, setTodoTitle] = useState('')
  const [todoDescription, setTodoDescription] = useState('')

  useEffect(() => {
    fetchTodoListDetails()
    fetchTodos()
  }, [listId, token])

  const fetchTodoListDetails = async () => {
    if (!token || !listId) return
    
    try {
      const response = await axios.get(`http://localhost:3000/api/todolists/${listId}`, {
        headers: { 'x-auth-token': token }
      })
      setTodoList(response.data)
    } catch (err) {
      setError('Failed to fetch todo list details')
      console.error(err)
    }
  }

  const fetchTodos = async () => {
    if (!token || !listId) return
    
    setIsLoading(true)
    try {
      const response = await axios.get(`http://localhost:3000/api/todos/list/${listId}`, {
        headers: { 'x-auth-token': token }
      })
      setTodos(response.data)
    } catch (err) {
      setError('Failed to fetch todos')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTodo = async () => {
    try {
      await axios.post(`http://localhost:3000/api/todos/list/${listId}`, 
        { 
          title: todoTitle,
          description: todoDescription 
        },
        { headers: { 'x-auth-token': token } }
      )
      fetchTodos()
      setShowModal(false)
      setTodoTitle('')
      setTodoDescription('')
    } catch (err) {
      setError('Failed to create todo')
      console.error(err)
    }
  }

  const handleUpdateTodo = async () => {
    try {
      await axios.put(`http://localhost:3000/api/todos/${editingTodo._id}`, 
        { 
          title: todoTitle,
          description: todoDescription 
        },
        { headers: { 'x-auth-token': token } }
      )
      fetchTodos()
      setShowModal(false)
      setTodoTitle('')
      setTodoDescription('')
      setEditingTodo(null)
    } catch (err) {
      setError('Failed to update todo')
      console.error(err)
    }
  }

  const handleToggleComplete = async (todo) => {
    try {
      await axios.put(`http://localhost:3000/api/todos/${todo._id}`, 
        { completed: !todo.completed },
        { headers: { 'x-auth-token': token } }
      )
      fetchTodos()
    } catch (err) {
      setError('Failed to update todo')
      console.error(err)
    }
  }

  const handleDeleteTodo = async (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await axios.delete(`http://localhost:3000/api/todos/${id}`, {
          headers: { 'x-auth-token': token }
        })
        fetchTodos()
      } catch (err) {
        setError('Failed to delete todo')
        console.error(err)
      }
    }
  }

  const openCreateModal = () => {
    setEditingTodo(null)
    setTodoTitle('')
    setTodoDescription('')
    setShowModal(true)
  }

  const openEditModal = (todo) => {
    setEditingTodo(todo)
    setTodoTitle(todo.title)
    setTodoDescription(todo.description || '')
    setShowModal(true)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div className="error-message">{error}</div>

  return (
    <div>
      <div className="list-header">
        <Link to="/todolists">&larr; Back to Lists</Link>
        <h1>{todoList?.name || 'Todo List'}</h1>
      </div>
      
      <button className="add-button" onClick={openCreateModal}>Add New Todo</button>
      
      {todos.length === 0 ? (
        <p>This list has no todos yet. Add one to get started!</p>
      ) : (
        <div className="todos-container">
          {todos.map(todo => (
            <div key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <div className="todo-item-content">
                <h3 className="todo-item-title">{todo.title}</h3>
                {todo.description && <p className="todo-item-description">{todo.description}</p>}
              </div>
              <div className="todo-item-actions">
                <input 
                  type="checkbox" 
                  checked={todo.completed} 
                  onChange={() => handleToggleComplete(todo)} 
                />
                <button onClick={() => openEditModal(todo)}>Edit</button>
                <button onClick={() => handleDeleteTodo(todo._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{editingTodo ? 'Edit Todo' : 'Add New Todo'}</h2>
            <div className="form-group">
              <label htmlFor="todoTitle">Title</label>
              <input
                type="text"
                id="todoTitle"
                value={todoTitle}
                onChange={(e) => setTodoTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="todoDescription">Description (optional)</label>
              <input
                type="text"
                id="todoDescription"
                value={todoDescription}
                onChange={(e) => setTodoDescription(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button 
                className="modal-submit" 
                onClick={editingTodo ? handleUpdateTodo : handleCreateTodo}
                disabled={!todoTitle.trim()}
              >
                {editingTodo ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TodoItems