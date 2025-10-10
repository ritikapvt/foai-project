// Offline queue management for check-in submissions

export interface CheckInPayload {
  user_id: string;
  date: string;
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
  baseline: any;
}

const QUEUE_KEY = "wellcheck_pending_queue";
const LAST_CHECKIN_KEY = "wellcheck_last_checkin";

export function addToQueue(payload: CheckInPayload): void {
  try {
    const queue = getQueue();
    queue.push({ payload, timestamp: Date.now() });
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error("Error adding to queue:", error);
  }
}

export function getQueue(): Array<{ payload: CheckInPayload; timestamp: number }> {
  try {
    const data = localStorage.getItem(QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading queue:", error);
    return [];
  }
}

export function clearQueue(): void {
  localStorage.removeItem(QUEUE_KEY);
}

export function getLastCheckIn(): { date: string; data: any } | null {
  try {
    const data = localStorage.getItem(LAST_CHECKIN_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error reading last check-in:", error);
    return null;
  }
}

export function saveLastCheckIn(date: string, data: any): void {
  try {
    localStorage.setItem(LAST_CHECKIN_KEY, JSON.stringify({ date, data }));
  } catch (error) {
    console.error("Error saving last check-in:", error);
  }
}

export function canCheckInToday(): boolean {
  const last = getLastCheckIn();
  if (!last) return true;
  
  const today = new Date().toISOString().split("T")[0];
  return last.date !== today;
}
