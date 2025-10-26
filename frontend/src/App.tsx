import { useAuth } from "./contexts/AuthContext";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
import InviteSignup from "./components/InviteSignup";
import AdminDashboard from "../assets/AdminDashboard";
import CoachDashboard from "./components/CoachDashboard";
import PlayerPage from "./components/PlayerPage";
import { Player } from "./lib/supabase";

function App() {
  const { user } = useAuth();
  const path = window.location.pathname;

  // Page d'inscription via invitation
  if (path.startsWith("/invite/")) {
    return <InviteSignup />;
  }

  if (!user) {
    if (path === "/signup") {
      return <SignUp />;
    }
    return <Auth />;
  }

  // Route Admin (nécessite d'être authentifié)
  if (path === "/admin") {
    return <AdminDashboard />;
  }

  // Route Coach (visualisation)
  if (path === "/coach") {
    return <CoachDashboard />;
  }

  // Route Player avec id (/player/:id)
  if (path.startsWith("/player/")) {
    const id = path.split("/")[2] || "";
    const dummyPlayer: Player = {
      id,
      user_id: user?.id || "demo-user",
      player_name: `Demo Player ${id}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return (
      <PlayerPage
        player={dummyPlayer}
        onBack={() => {
          window.location.href = "/";
        }}
      />
    );
  }

  if (path === "/profile") {
    return <Profile />;
  }

  return <Dashboard />;
}

export default App;
