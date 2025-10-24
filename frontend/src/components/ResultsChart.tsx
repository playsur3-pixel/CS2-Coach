import React from 'react';
import type { TrainingSession } from '../lib/supabase';

type MetricKey = 'hs_rate' | 'accuracy' | 'kills' | 'deaths' | 'duration_minutes' | 'kd';

type ResultsChartProps = {
  sessions: TrainingSession[];
  metric: MetricKey;
  height?: number;
};

function formatDateLabel(iso: string) {
  try {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  } catch {
    return iso.slice(0, 10);
  }
}

function getMetricValue(s: TrainingSession, metric: MetricKey) {
  if (metric === 'kd') {
    return s.deaths === 0 ? s.kills : s.kills / s.deaths;
  }
  return Number(s[metric] as any);
}

export default function ResultsChart({ sessions, metric, height = 220 }: ResultsChartProps) {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="p-6 text-zinc-500">Aucune donnée de session pour le graphique.</div>
    );
  }

  // Sort by date ascending for a left-to-right progression
  const sorted = [...sessions].sort((a, b) =>
    new Date(a.session_date).getTime() - new Date(b.session_date).getTime()
  );

  const values = sorted.map(s => getMetricValue(s, metric));
  const yMin = Math.min(...values);
  const yMaxRaw = Math.max(...values);
  const yMax = yMaxRaw === yMin ? yMin + 1 : yMaxRaw;

  const width = 640; // fixed width container; responsive could be added later
  const padding = 30;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  const points = values.map((v, i) => {
    const x = padding + (i / Math.max(sorted.length - 1, 1)) * innerWidth;
    const ratio = (v - yMin) / (yMax - yMin);
    const y = padding + innerHeight - ratio * innerHeight;
    return `${x},${y}`;
  });

  const path = `M ${points.join(' L ')}`;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-zinc-400">Métrique: <span className="text-white font-medium">{metric.toUpperCase()}</span></div>
        <div className="text-sm text-zinc-400">Min: <span className="text-white">{yMin.toFixed(2)}</span> · Max: <span className="text-white">{yMax.toFixed(2)}</span></div>
      </div>
      <svg width={width} height={height} className="bg-zinc-900/40 rounded-md border border-zinc-800">
        {/* Axes */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#3f3f46" strokeWidth={1} />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#3f3f46" strokeWidth={1} />

        {/* Path */}
        <path d={path} fill="none" stroke="#f97316" strokeWidth={2} />

        {/* Points */}
        {points.map((p, i) => {
          const [xStr, yStr] = p.split(',');
          const x = Number(xStr);
          const y = Number(yStr);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={3} fill="#fb923c" />
              {/* Date labels every N points */}
              {i % Math.ceil(sorted.length / 6) === 0 && (
                <text x={x} y={height - padding + 14} fontSize={10} textAnchor="middle" fill="#a1a1aa">
                  {formatDateLabel(sorted[i].session_date)}
                </text>
              )}
            </g>
          );
        })}

        {/* Y labels */}
        <text x={padding - 6} y={padding} fontSize={10} textAnchor="end" fill="#a1a1aa">{yMax.toFixed(2)}</text>
        <text x={padding - 6} y={height - padding} fontSize={10} textAnchor="end" fill="#a1a1aa">{yMin.toFixed(2)}</text>
      </svg>
    </div>
  );
}