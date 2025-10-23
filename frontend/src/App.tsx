import { useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import SignUp from './components/SignUp';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-stone-900 to-neutral-900 flex items-center justify-center">
        <div className="text-orange-500 text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  // Simple routing basé sur l'URL
  const path = window.location.pathname;
  
  if (user) {
    return <Dashboard />;
  }
  
  if (path === '/signup') {
    return <SignUp />;
  }
  
  return <Auth />;
}

export default App;
