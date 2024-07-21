import React, { useState, useEffect } from 'react';
import api from './api';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    task: ""
  });

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks/');
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/tasks/', taskData);
      fetchTasks();
      setTaskData({
        task: ""
      });
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div>
      <nav className='navbar navbar-dark bg-primary'>
        <div className='container-fluid'>
          <a className='navbar-brand' href='/'>
            Todo App
          </a>
        </div>
      </nav>

      <div className='container'>
        <form onSubmit={handleFormSubmit}>
          <div className='mb-3 mt-3'>
            <label htmlFor='task' className='form-label'>
              Task
            </label>
            <input
              type='text'
              className='form-control'
              id='task'
              name='task'
              value={taskData.task}
              onChange={handleInputChange}
            />
          </div>

          <button type='submit' className='btn btn-primary'>
            Submit
          </button>
        </form>

        <table className='table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              <th>Task</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.task}</td>
                <td>
                  <button onClick={() => handleDeleteTask(task.id)} className='btn btn-danger'>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
