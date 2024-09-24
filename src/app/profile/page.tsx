'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/firebaseconfig';
import { ROUTES } from '../../constants/routes';

type Todo = {
  id: string;
  text: string;
};

const ProfilePage = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    if (!loading && (!user || !user.emailVerified)) {
      router.push(ROUTES.HOME);
    }
  }, [user, loading, router]);

  const fetchTodos = async () => {
    if (!user) return;
    try {
      const todosCollection = collection(firestore, 'todos');
      const userTodosQuery = query(todosCollection, where('userId', '==', user.uid));
      const todoSnapshot = await getDocs(userTodosQuery);
      const todoList = todoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Todo));
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
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setNewTodo(todo.text);
  };

  const handleUpdateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTodo) return;
    try {
      const todoDoc = doc(firestore, 'todos', editingTodo.id);
      await updateDoc(todoDoc, {
        text: newTodo,
      });
      setEditingTodo(null);
      setNewTodo('');
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push(ROUTES.HOME);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Welcome, {user?.email}
        </h1>
        <form onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo} className="flex space-x-2 mb-6">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder={editingTodo ? "Edit your task..." : "Add a new to-do..."}
            required
          />
          <button
            type="submit"
            className={`bg-${editingTodo ? 'green' : 'indigo'}-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-${editingTodo ? 'green' : 'indigo'}-600 transition duration-300`}
          >
            {editingTodo ? "Update" : "Add"}
          </button>
        </form>

        <ul className="space-y-4">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow"
            >
              <span className="text-gray-700">{todo.text}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditTodo(todo)}
                  className="bg-yellow-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-yellow-600 transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="bg-red-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
