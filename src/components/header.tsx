// components/header.tsx
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header>
      <nav>
        <Link href={ROUTES.HOME}>Home</Link>
        {user ? (
          <>
            <Link href={ROUTES.PROFILE}>Profile</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link href={ROUTES.LOGIN}>Login</Link>
            <Link href={ROUTES.REGISTER}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
