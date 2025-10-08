// LocalStorage helper functions for WellCheck

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
