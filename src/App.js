import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [lastId, setLastId] = useState(0); 
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    email: ''
  });
  const [editingUser, setEditingUser] = useState(null); 

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      setUsers(parsedUsers);
      if (parsedUsers.length > 0) {
        const maxId = Math.max(...parsedUsers.map(user => user.id));
        setLastId(maxId);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddUser = () => {
    if (
      formData.name.trim() !== '' &&
      formData.address.trim() !== '' &&
      formData.phoneNumber.trim() !== '' &&
      formData.email.trim() !== ''
    ) {
      const newId = lastId + 1;
      const newUser = { id: newId, ...formData }; 
      setUsers([...users, newUser]);
      setFormData({ name: '', address: '', phoneNumber: '', email: '' });
      setLastId(newId); 
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData(user); 
  };

  const handleSaveEdit = () => {
    const updatedUsers = users.map((user) =>
      user.id === formData.id ? formData : user
    );
    setUsers(updatedUsers);
    setFormData({ name: '', address: '', phoneNumber: '', email: '' });
    setEditingUser(null);
  };

  const handleDeleteUser = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    setEditingUser(null); 
  };

  const handleExportToJson = () => {
    const jsonContent = JSON.stringify(users, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-container">
      <h1>Database Management App</h1>
      <div className="form-container">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter name"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter address"
        />
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Enter phone number"
        />
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
        />
        {editingUser ? (
          <button onClick={handleSaveEdit}>Save Edit</button>
        ) : (
          <button onClick={handleAddUser}>Add User</button>
        )}
        <button onClick={handleExportToJson}>Export to JSON</button>
      </div>
      {users.length > 0 ? (
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.address}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleEditUser(user)}>Edit</button>
                  <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
}

export default App;
