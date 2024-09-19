'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { firestore } from '../../firebase/firebaseconfig';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const ProfilePage = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    if (!loading && (!user || !user.emailVerified)) {
      router.push(ROUTES.VERIFY_EMAIL);
    }
  }, [user, loading, router]);

  const fetchTodos = async () => {
    if (!user) return;
    try {
      const todosCollection = collection(firestore, 'todos');
      const todoSnapshot = await getDocs(todosCollection);
      const todoList = todoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTodos(todoList);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [user]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const todosCollection = collection(firestore, 'todos');
      await addDoc(todosCollection, {
        text: newTodo,
        userId: user?.uid,
        createdAt: new Date(),
      });
      setNewTodo('');
      fetchTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const todoDoc = doc(firestore, 'todos', id);
      await deleteDoc(todoDoc);
      fetchTodos(); // Refresh to-do list
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50'>
      <div className='bg-white shadow-lg rounded-lg p-8 max-w-md w-full'>
        <h1 className='text-2xl font-bold mb-6 text-center text-gray-700'>
          Welcome, {user?.email}
        </h1>
        <form onSubmit={handleAddTodo} className='flex space-x-2 mb-6'>
          <input
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            type='text'
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder='Add a new to-do...'
            required
          />
          <button
            type='submit'
            className='bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300'>
            Add
          </button>
        </form>

        <ul className='space-y-4'>
          {todos.map((todo) => (
            <li
              key={todo.id}
              className='flex justify-between items-center bg-gray-100 p-4 rounded-md shadow'>
              <span className='text-gray-700'>{todo.text}</span>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className='bg-red-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-red-600 transition duration-300'>
                Delete
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={logout}
          className='mt-6 w-full bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-600 transition duration-300'>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
