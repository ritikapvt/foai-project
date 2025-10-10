// LocalStorage helper functions for WellCheck

export interface CheckInEntry {
  date: string; // YYYY-MM-DD
  responses: {
    work_hours: number;
    sleep_hours: number;
    sleep_quality: number;
    stress_level: number;
    mood: number;
    workload: number;
    focus: number;
    activity_minutes: number;
    connectedness: number;
  };
  result?: {
    risk: string;
    score: number;
    top_factors?: Array<{ feature: string; contribution: number }>;
    tips?: string[];
  };
}

export interface UserProfile {
  id: string;
  name?: string;
  ageGroup: string;
  workMode: string;
  consent: boolean;
  baseline?: {
    baseline_stress: number;
    baseline_sleep_hours: number;
    baseline_focus: number;
    baseline_activity: number;
    baseline_work_style: string;
  };
  savedTips?: string[];
  history?: CheckInEntry[];
  currentStreak?: number;
  longestStreak?: number;
  useLocalInsights?: boolean;
  learningCompleted?: Array<{ id: string; timestamp: string }>;
  preferences?: {
    notifications?: boolean;
    serverAnalytics?: boolean;
    demoMode?: boolean;
    fontSize?: 'small' | 'medium' | 'large';
  };
}

const STORAGE_KEYS = {
  USER: 'wellcheck_user',
  TOKEN: 'wellcheck_token',
  RESPONSES: 'wellcheck_responses',
} as const;

export const DEMO_USER: UserProfile = {
  id: 'demo-user',
  name: 'Jane',
  ageGroup: '25-34',
  workMode: 'remote',
  consent: true,
  baseline: {
    baseline_stress: 6,
    baseline_sleep_hours: 6,
    baseline_focus: 3,
    baseline_activity: 20,
    baseline_work_style: 'Interrupted',
  },
};

export function getUser(): UserProfile | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading user from localStorage:', error);
    return null;
  }
}

export function saveUser(user: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
  }
}

export function isOnboarded(): boolean {
  const user = getUser();
  return !!(user && user.consent && user.ageGroup);
}

export function hasBaseline(): boolean {
  const user = getUser();
  return !!(user && user.baseline);
}

export function loadDemoUser(): void {
  saveUser(DEMO_USER);
}

export function clearUser(): void {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.RESPONSES);
}

export function addCheckInToHistory(entry: CheckInEntry): void {
  const user = getUser();
  if (!user) return;

  if (!user.history) user.history = [];
  
  // Remove existing entry for same date if exists
  user.history = user.history.filter(e => e.date !== entry.date);
  user.history.push(entry);
  
  // Sort by date descending
  user.history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Update streak
  updateStreak(user);
  
  saveUser(user);
}

export function updateStreak(user: UserProfile): void {
  if (!user.history || user.history.length === 0) {
    user.currentStreak = 0;
    return;
  }

  const sortedHistory = [...user.history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedHistory.length; i++) {
    const entryDate = new Date(sortedHistory[i].date);
    entryDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    expectedDate.setHours(0, 0, 0, 0);

    if (entryDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  user.currentStreak = streak;
  if (!user.longestStreak || streak > user.longestStreak) {
    user.longestStreak = streak;
  }
}

export function getCheckInHistory(days: number = 28): CheckInEntry[] {
  const user = getUser();
  if (!user || !user.history) return [];

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  cutoffDate.setHours(0, 0, 0, 0);

  return user.history.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= cutoffDate;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
