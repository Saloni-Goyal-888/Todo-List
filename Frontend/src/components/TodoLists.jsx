import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function TodoLists({ token }) {
  const [todoLists, setTodoLists] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [editingList, setEditingList] = useState(null)

  useEffect(() => {
    fetchTodoLists()
  }, [token])

  const fetchTodoLists = async () => {
    if (!token) return
    
    setIsLoading(true)
    try {
      const response = await axios.get('http://localhost:3000/api/todolists', {
        headers: { 'x-auth-token': token }
      })
      setTodoLists(response.data)
    } catch (err) {
      setError('Failed to fetch todo lists')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateList = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/todolists', 
        { name: newListName },
        { headers: { 'x-auth-token': token } }
      )
      fetchTodoLists()
      setShowModal(false)
      setNewListName('')
    } catch (err) {
      setError('Failed to create todo list')
      console.error(err)
    }
  }

  const handleUpdateList = async () => {
    try {
      await axios.put(`http://localhost:3000/api/todolists/${editingList._id}`, 
        { name: newListName },
        { headers: { 'x-auth-token': token } }
      )
      fetchTodoLists()
      setShowModal(false)
      setNewListName('')
      setEditingList(null)
    } catch (err) {
      setError('Failed to update todo list')
      console.error(err)
    }
  }

  const handleDeleteList = async (id) => {
    if (window.confirm('Are you sure you want to delete this list and all its todos?')) {
      try {
        await axios.delete(`http://localhost:3000/api/todolists/${id}`, {
          headers: { 'x-auth-token': token }
        })
        fetchTodoLists()
      } catch (err) {
        setError('Failed to delete todo list')
        console.error(err)
      }
    }
  }

  const openCreateModal = () => {
    setEditingList(null)
    setNewListName('')
    setShowModal(true)
  }

  const openEditModal = (list) => {
    setEditingList(list)
    setNewListName(list.name)
    setShowModal(true)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div className="error-message">{error}</div>

  return (
    <div>
      <h1>My Todo Lists</h1>
      <button className="add-button" onClick={openCreateModal}>Create New List</button>
      
      {todoLists.length === 0 ? (
        <p>You don't have any todo lists yet. Create one to get started!</p>
      ) : (
        <div className="todolist-container">
          {todoLists.map(list => (
            <div key={list._id} className="todolist-card">
              <h3>{list.name}</h3>
              <div className="todolist-actions">
                <Link to={`/todolists/${list._id}`} className="view-button">View Todos</Link>
                <div>
                  <button onClick={() => openEditModal(list)}>Edit</button>
                  <button onClick={() => handleDeleteList(list._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{editingList ? 'Edit Todo List' : 'Create New Todo List'}</h2>
            <div className="form-group">
              <label htmlFor="listName">List Name</label>
              <input
                type="text"
                id="listName"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                required
              />
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button 
                className="modal-submit" 
                onClick={editingList ? handleUpdateList : handleCreateList}
                disabled={!newListName.trim()}
              >
                {editingList ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TodoLists