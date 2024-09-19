import Link from 'next/link';
import { ROUTES } from '../constants/routes';

const HomePage = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50'>
      <div className='bg-white shadow-md rounded-lg p-8 max-w-lg w-full text-center'>
        <h1 className='text-3xl font-bold mb-6 text-gray-800'>
          Welcome to the To-Do List App
        </h1>
        <p className='text-gray-600 mb-8'>
          Manage your tasks efficiently by adding and deleting to-do items. Your data is stored securely in Firestore.
        </p>

        <div className='flex flex-col space-y-4'>
          <Link href={ROUTES.LOGIN} className='w-full'>
            <button className='w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300'>
              Login
            </button>
          </Link>
          <Link href={ROUTES.REGISTER} className='w-full'>
            <button className='w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600 transition duration-300'>
              Register
            </button>
          </Link>
        </div>

        <div className='mt-8'>
          <h2 className='text-xl font-semibold text-gray-700'>Features:</h2>
          <ul className='list-disc text-left mt-4 space-y-2 text-gray-600'>
            <li>Effortlessly add new tasks to your to-do list.</li>
            <li>Delete tasks once they are completed.</li>
            <li>Data is securely stored in Firestore.</li>
            <li>Access your tasks from anywhere.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
