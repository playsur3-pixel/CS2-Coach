import { useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import SignUp from './components/SignUp';
import Profile from './components/Profile';

function App() {
  const { user } = useAuth();
  const path = window.location.pathname;

  if (!user) {
    if (path === '/signup') {
      return <SignUp />;
    }
    return <Auth />;
  }

  if (path === '/profile') {
    return <Profile />;
  }

  return <Dashboard />;
}

export default App;
