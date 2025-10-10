// Data export utilities

import { getUser } from './storage';

export function exportDataAsCSV(): void {
  const user = getUser();
  if (!user || !user.history) {
    console.error('No data to export');
    return;
  }

  const headers = [
    'date',
    'work_hours',
    'sleep_hours',
    'sleep_quality',
    'stress_level',
    'mood',
    'workload',
    'focus',
    'activity_minutes',
    'connectedness',
    'risk',
    'score',
  ];

  const rows = user.history.map((entry) => {
    const { date, responses, result } = entry;
    return [
      date,
      responses.work_hours,
      responses.sleep_hours,
      responses.sleep_quality,
      responses.stress_level,
      responses.mood,
      responses.workload,
      responses.focus,
      responses.activity_minutes,
      responses.connectedness,
      result?.risk || '',
      result?.score || '',
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `wellcheck-data-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}