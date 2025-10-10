import { CheckInEntry } from "./storage";

export interface Insight {
  type: "correlation";
  variables: [string, string];
  correlation: number;
  confidence: "Low" | "Medium" | "High";
  message: string;
  dataPoints: Array<{ x: number; y: number; date: string }>;
}

function pearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n === 0 || n !== y.length) return 0;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (denominator === 0) return 0;
  return numerator / denominator;
}

function getConfidence(correlation: number, n: number): "Low" | "Medium" | "High" {
  const absCorr = Math.abs(correlation);
  if (n < 10) return "Low";
  if (absCorr >= 0.5 && n >= 20) return "High";
  if (absCorr >= 0.3 && n >= 10) return "Medium";
  return "Low";
}

export function calculateInsights(history: CheckInEntry[]): Insight[] {
  const insights: Insight[] = [];

  if (history.length < 10) return insights;

  // Sleep vs Stress correlation
  const sleepStressData = history
    .filter(e => e.responses.sleep_hours != null && e.responses.stress_level != null)
    .map(e => ({
      sleep: e.responses.sleep_hours,
      stress: e.responses.stress_level,
      date: e.date,
    }));

  if (sleepStressData.length >= 10) {
    const sleepValues = sleepStressData.map(d => d.sleep);
    const stressValues = sleepStressData.map(d => d.stress);
    const corr = pearsonCorrelation(sleepValues, stressValues);

    if (Math.abs(corr) >= 0.30) {
      insights.push({
        type: "correlation",
        variables: ["sleep_hours", "stress"],
        correlation: corr,
        confidence: getConfidence(corr, sleepStressData.length),
        message:
          corr <= -0.30
            ? "Your sleep hours are strongly linked to stress. On days you sleep more, your stress tends to be lower."
            : "Interestingly, more sleep correlates with higher stress for you. Consider sleep quality, not just hours.",
        dataPoints: sleepStressData.map(d => ({
          x: d.sleep,
          y: d.stress,
          date: d.date,
        })),
      });
    }
  }

  // Activity vs Mood correlation
  const activityMoodData = history
    .filter(e => e.responses.activity_minutes != null && e.responses.mood != null)
    .map(e => ({
      activity: e.responses.activity_minutes,
      mood: e.responses.mood,
      date: e.date,
    }));

  if (activityMoodData.length >= 10) {
    const activityValues = activityMoodData.map(d => d.activity);
    const moodValues = activityMoodData.map(d => d.mood);
    const corr = pearsonCorrelation(activityValues, moodValues);

    if (Math.abs(corr) >= 0.30) {
      insights.push({
        type: "correlation",
        variables: ["activity_minutes", "mood"],
        correlation: corr,
        confidence: getConfidence(corr, activityMoodData.length),
        message:
          corr >= 0.30
            ? "Days with more activity correlate with better mood."
            : "Lower activity seems to correlate with better mood for you. Perhaps rest is key.",
        dataPoints: activityMoodData.map(d => ({
          x: d.activity,
          y: d.mood,
          date: d.date,
        })),
      });
    }
  }

  return insights;
}

export function getWeeklySummary(history: CheckInEntry[]): {
  thisWeek: {
    avgMood: number;
    avgStress: number;
    avgSleep: number;
    avgRisk: number;
  };
  lastWeek: {
    avgMood: number;
    avgStress: number;
    avgSleep: number;
    avgRisk: number;
  };
  changes: {
    mood: number;
    stress: number;
    sleep: number;
    risk: number;
  };
  recommendation: string;
} {
  const now = new Date();
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - 7);
  const lastWeekStart = new Date(now);
  lastWeekStart.setDate(now.getDate() - 14);

  const thisWeekData = history.filter(e => new Date(e.date) >= thisWeekStart);
  const lastWeekData = history.filter(
    e => new Date(e.date) >= lastWeekStart && new Date(e.date) < thisWeekStart
  );

  const avg = (arr: number[]) => (arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

  const riskToNumber = (risk?: string) => {
    if (!risk) return 0;
    if (risk === "Low") return 1;
    if (risk === "Medium") return 2;
    return 3;
  };

  const thisWeek = {
    avgMood: avg(thisWeekData.map(e => e.responses.mood)),
    avgStress: avg(thisWeekData.map(e => e.responses.stress_level)),
    avgSleep: avg(thisWeekData.map(e => e.responses.sleep_hours)),
    avgRisk: avg(thisWeekData.map(e => riskToNumber(e.result?.risk))),
  };

  const lastWeek = {
    avgMood: avg(lastWeekData.map(e => e.responses.mood)),
    avgStress: avg(lastWeekData.map(e => e.responses.stress_level)),
    avgSleep: avg(lastWeekData.map(e => e.responses.sleep_hours)),
    avgRisk: avg(lastWeekData.map(e => riskToNumber(e.result?.risk))),
  };

  const changes = {
    mood: lastWeek.avgMood > 0 ? ((thisWeek.avgMood - lastWeek.avgMood) / lastWeek.avgMood) * 100 : 0,
    stress: lastWeek.avgStress > 0 ? ((thisWeek.avgStress - lastWeek.avgStress) / lastWeek.avgStress) * 100 : 0,
    sleep: lastWeek.avgSleep > 0 ? ((thisWeek.avgSleep - lastWeek.avgSleep) / lastWeek.avgSleep) * 100 : 0,
    risk: lastWeek.avgRisk > 0 ? ((thisWeek.avgRisk - lastWeek.avgRisk) / lastWeek.avgRisk) * 100 : 0,
  };

  let recommendation = "Keep checking in regularly for personalized insights.";
  
  if (changes.stress < -10 && changes.sleep > 5) {
    recommendation = "Sleep improved and stress is down — great progress! Keep it up.";
  } else if (changes.stress > 10 && changes.sleep < -5) {
    recommendation = "Stress is up and sleep is down. Try to prioritize rest this week.";
  } else if (changes.sleep > 10) {
    recommendation = `Sleep improved by ${Math.round(changes.sleep)}% this week — great! Keep it up.`;
  } else if (changes.mood > 10) {
    recommendation = "Mood is trending up — you're doing well!";
  } else if (changes.stress < -10) {
    recommendation = "Stress decreased this week — nice work managing it.";
  }

  return { thisWeek, lastWeek, changes, recommendation };
}
