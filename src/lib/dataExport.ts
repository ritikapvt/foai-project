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
    'mood',
    'stress',
    'sleep_hours',
    'workload',
    'focus',
    'activity_minutes',
    'notes',
    'risk',
    'score',
  ];

  const rows = user.history.map((entry) => {
    const { date, responses, result } = entry;
    return [
      date,
      responses.mood,
      responses.stress,
      responses.sleep_hours,
      responses.workload,
      responses.focus,
      responses.activity_minutes,
      responses.notes || '',
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