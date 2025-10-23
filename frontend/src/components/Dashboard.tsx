import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Player, TrainingSession } from '../lib/supabase';
import { Crosshair, Target, Activity, TrendingUp, Plus, LogOut, Users } from 'lucide-react';
import AddSessionModal from './AddSessionModal';
import AddPlayerModal from './AddPlayerModal';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [showAddSession, setShowAddSession] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayers();
  }, []);

  useEffect(() => {
    if (selectedPlayer) {
      loadSessions(selectedPlayer);
    }
  }, [selectedPlayer]);

  const loadPlayers = async () => {
    const { data } = await supabase
      .from('players')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setPlayers(data);
      if (data.length > 0 && !selectedPlayer) {
        setSelectedPlayer(data[0].id);
      }
    }
    setLoading(false);
  };

  const loadSessions = async (playerId: string) => {
    const { data } = await supabase
      .from('training_sessions')
      .select('*')
      .eq('player_id', playerId)
      .order('session_date', { ascending: false });

    if (data) {
      setSessions(data);
    }
  };

  const calculateAverage = (key: keyof TrainingSession) => {
    if (sessions.length === 0) return 0;
    const sum = sessions.reduce((acc, s) => acc + Number(s[key]), 0);
    return (sum / sessions.length).toFixed(2);
  };

  const calculateKD = () => {
    const totalKills = sessions.reduce((acc, s) => acc + s.kills, 0);
    const totalDeaths = sessions.reduce((acc, s) => acc + s.deaths, 0);
    return totalDeaths === 0 ? totalKills : (totalKills / totalDeaths).toFixed(2);
  };

  const selectedPlayerData = players.find(p => p.id === selectedPlayer);

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-stone-950 to-neutral-950"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-orange-500/20 via-orange-600/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-zinc-700/20 via-stone-700/10 to-transparent blur-3xl"></div>
        <div className="text-orange-500 text-xl font-semibold relative z-10">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-stone-950 to-neutral-950"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-orange-500/20 via-orange-600/10 to-transparent blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-zinc-700/20 via-stone-700/10 to-transparent blur-3xl"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-5"></div>

      <div className="relative z-10">
        <header className="border-b border-orange-500/30 bg-zinc-950/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crosshair className="w-8 h-8 text-orange-500" strokeWidth={2.5} />
              <div>
                <h1 className="text-2xl font-bold text-white">CS2 COACH</h1>
                <p className="text-xs text-zinc-400">Performance Tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-zinc-400 text-sm">{user?.email}</span>
              <button
                onClick={signOut}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-md flex items-center gap-2 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Users className="w-6 h-6 text-orange-500" />
              <select
                value={selectedPlayer || ''}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 text-white px-4 py-2 rounded-md focus:outline-none focus:border-orange-500"
              >
                {players.length === 0 && (
                  <option value="">No players yet</option>
                )}
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.player_name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowAddPlayer(true)}
                className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-md flex items-center gap-2 transition shadow-lg shadow-orange-600/30"
              >
                <Plus className="w-5 h-5" />
                <span>Add Player</span>
              </button>
            </div>

            {selectedPlayer && (
              <button
                onClick={() => setShowAddSession(true)}
                className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-6 py-2 rounded-md flex items-center gap-2 transition shadow-lg shadow-orange-600/20 font-semibold"
              >
                <Plus className="w-5 h-5" />
                <span>New Session</span>
              </button>
            )}
          </div>

          {selectedPlayer ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-zinc-950/80 backdrop-blur-xl border-2 border-zinc-800/50 rounded-lg p-6 shadow-xl shadow-black/30">
                  <div className="flex items-center justify-between mb-3">
                    <Target className="w-8 h-8 text-orange-500" />
                    <span className="text-xs text-zinc-500 font-semibold">AVG</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {calculateAverage('hs_rate')}%
                  </div>
                  <div className="text-sm text-zinc-400 font-medium">Headshot Rate</div>
                </div>

                <div className="bg-zinc-950/80 backdrop-blur-xl border-2 border-zinc-800/50 rounded-lg p-6 shadow-xl shadow-black/30">
                  <div className="flex items-center justify-between mb-3">
                    <Activity className="w-8 h-8 text-amber-500" />
                    <span className="text-xs text-zinc-500 font-semibold">RATIO</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {calculateKD()}
                  </div>
                  <div className="text-sm text-zinc-400 font-medium">K/D Ratio</div>
                </div>

                <div className="bg-zinc-950/80 backdrop-blur-xl border-2 border-zinc-800/50 rounded-lg p-6 shadow-xl shadow-black/30">
                  <div className="flex items-center justify-between mb-3">
                    <TrendingUp className="w-8 h-8 text-green-500" />
                    <span className="text-xs text-zinc-500 font-semibold">AVG</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {calculateAverage('accuracy')}%
                  </div>
                  <div className="text-sm text-zinc-400 font-medium">Accuracy</div>
                </div>

                <div className="bg-zinc-950/80 backdrop-blur-xl border-2 border-zinc-800/50 rounded-lg p-6 shadow-xl shadow-black/30">
                  <div className="flex items-center justify-between mb-3">
                    <Crosshair className="w-8 h-8 text-blue-500" />
                    <span className="text-xs text-zinc-500 font-semibold">TOTAL</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {sessions.length}
                  </div>
                  <div className="text-sm text-zinc-400 font-medium">Sessions</div>
                </div>
              </div>

              <div className="bg-zinc-950/80 backdrop-blur-xl border-2 border-zinc-800/50 rounded-lg shadow-xl shadow-black/30">
                <div className="p-6 border-b border-zinc-800">
                  <h2 className="text-xl font-bold text-white">Training Sessions</h2>
                  <p className="text-zinc-400 text-sm mt-1">
                    {selectedPlayerData?.player_name}'s performance history
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-zinc-900/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Map</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">HS Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">K/D</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Accuracy</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {sessions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                            No training sessions yet. Click "New Session" to add one.
                          </td>
                        </tr>
                      ) : (
                        sessions.map((session) => (
                          <tr key={session.id} className="hover:bg-zinc-900/50 transition">
                            <td className="px-6 py-4 text-sm text-zinc-300">
                              {new Date(session.session_date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-zinc-300 font-medium">
                              {session.map_name}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className="text-orange-400 font-semibold">{session.hs_rate}%</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-zinc-300">
                              {session.kills}/{session.deaths}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className="text-green-400 font-semibold">{session.accuracy}%</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-zinc-300">
                              {session.duration_minutes}m
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-zinc-950/80 backdrop-blur-xl border-2 border-zinc-800/50 rounded-lg shadow-xl shadow-black/30 p-12 text-center">
              <Users className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Players Yet</h3>
              <p className="text-zinc-400 mb-6">Add your first player to start tracking performance</p>
              <button
                onClick={() => setShowAddPlayer(true)}
                className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-md inline-flex items-center gap-2 transition shadow-lg shadow-orange-600/30"
              >
                <Plus className="w-5 h-5" />
                <span>Add Your First Player</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {showAddSession && selectedPlayer && (
        <AddSessionModal
          playerId={selectedPlayer}
          onClose={() => setShowAddSession(false)}
          onSuccess={() => {
            loadSessions(selectedPlayer);
            setShowAddSession(false);
          }}
        />
      )}

      {showAddPlayer && (
        <AddPlayerModal
          onClose={() => setShowAddPlayer(false)}
          onSuccess={() => {
            loadPlayers();
            setShowAddPlayer(false);
          }}
        />
      )}
    </div>
  );
}
