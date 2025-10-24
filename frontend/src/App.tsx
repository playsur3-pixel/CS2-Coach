import { useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import InviteSignup from './components/InviteSignup';

function App() {
  const { user } = useAuth();
  const path = window.location.pathname;

  // Page d'inscription via invitation
  if (path.startsWith('/invite/')) {
    return <InviteSignup />;
  }

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
