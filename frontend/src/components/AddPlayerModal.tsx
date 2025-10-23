import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { X, Users } from 'lucide-react';

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddPlayerModal({ onClose, onSuccess }: Props) {
  const { user } = useAuth();
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: insertError } = await supabase
      .from('players')
      .insert([
        {
          user_id: user?.id,
          player_name: playerName,
        },
      ]);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-950/90 backdrop-blur-xl border-2 border-zinc-800/50 rounded-lg shadow-2xl shadow-black/50 w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold text-white">Add New Player</h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-zinc-300 text-sm font-semibold mb-2">
              PLAYER NAME
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md py-3 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
              placeholder="Enter player name"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 px-4 rounded-md transition font-semibold"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white py-3 px-4 rounded-md transition shadow-lg shadow-orange-600/20 font-semibold disabled:opacity-50"
            >
              {loading ? 'ADDING...' : 'ADD PLAYER'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
