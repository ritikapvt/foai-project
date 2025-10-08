// API integration for check-in submissions
import { CheckInPayload } from "./checkInQueue";

export interface PredictionResponse {
  risk: "Low" | "Medium" | "High";
  score: number;
  top_factors: Array<{
    feature: string;
    contribution: number;
  }>;
  tips: string[];
}

// Demo API responses for testing
const DEMO_RESPONSES: Record<string, PredictionResponse> = {
  low: {
    risk: "Low",
    score: 0.32,
    top_factors: [
      { feature: "sleep_hours", contribution: 0.15 },
      { feature: "activity_minutes", contribution: 0.10 },
      { feature: "mood", contribution: 0.07 },
    ],
    tips: [
      "Great job maintaining your routine! Keep it up.",
      "Consider adding a short meditation session to enhance your wellbeing.",
    ],
  },
  medium: {
    risk: "Medium",
    score: 0.62,
    top_factors: [
      { feature: "sleep_hours", contribution: 0.27 },
      { feature: "stress", contribution: 0.21 },
      { feature: "activity_minutes", contribution: 0.12 },
    ],
    tips: [
      "Take a 10-minute walk after your next meeting.",
      "Try to get 7+ hours of sleep tonight.",
      "Consider a brief break every hour to reduce stress.",
    ],
  },
  high: {
    risk: "High",
    score: 0.84,
    top_factors: [
      { feature: "stress", contribution: 0.38 },
      { feature: "sleep_hours", contribution: 0.29 },
      { feature: "focus", contribution: 0.17 },
    ],
    tips: [
      "Your stress levels are elevated. Take a 15-minute break now.",
      "Prioritize 8 hours of sleep tonight - it's crucial for recovery.",
      "Consider speaking with your manager about workload balance.",
      "Try a guided breathing exercise (5 minutes).",
    ],
  },
};

function getDemoResponse(payload: CheckInPayload): PredictionResponse {
  const { stress, sleep_hours, mood } = payload.responses;
  
  // Simple heuristic for demo
  if (stress >= 8 || sleep_hours < 5 || mood <= 2) {
    return DEMO_RESPONSES.high;
  } else if (stress >= 5 || sleep_hours < 6.5 || mood <= 3) {
    return DEMO_RESPONSES.medium;
  } else {
    return DEMO_RESPONSES.low;
  }
}

export async function submitCheckIn(
  payload: CheckInPayload,
  useDemoApi: boolean = true
): Promise<PredictionResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (useDemoApi) {
    return getDemoResponse(payload);
  }

  // Real API call (implement when backend is ready)
  const response = await fetch("/api/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("RATE_LIMIT");
    } else if (response.status === 400) {
      const error = await response.json();
      throw new Error(`VALIDATION: ${error.message}`);
    } else {
      throw new Error("SERVER_ERROR");
    }
  }

  return response.json();
}
