// Learning module definitions

export interface LearningModule {
  id: string;
  title: string;
  summary: string;
  duration: string;
  type: 'article' | 'video';
  tags: string[];
  contentUrl: string;
  thumbnail?: string;
}

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'stress-management-basics',
    title: 'Stress Management Basics',
    summary: 'Learn simple techniques to reduce workplace stress and anxiety',
    duration: '3 min read',
    type: 'article',
    tags: ['stress', 'mindfulness', 'workplace'],
    contentUrl: '#',
  },
  {
    id: 'sleep-hygiene',
    title: 'Sleep Hygiene 101',
    summary: 'Improve your sleep quality for better productivity and mood',
    duration: '4 min read',
    type: 'article',
    tags: ['sleep', 'health', 'recovery'],
    contentUrl: '#',
  },
  {
    id: 'desk-stretches',
    title: 'Quick Desk Stretches',
    summary: 'Easy stretches you can do at your desk to boost energy',
    duration: '2 min video',
    type: 'video',
    tags: ['activity', 'energy', 'movement'],
    contentUrl: '#',
  },
  {
    id: 'focus-techniques',
    title: 'Boost Your Focus',
    summary: 'Science-backed methods to improve concentration and mental clarity',
    duration: '3 min read',
    type: 'article',
    tags: ['focus', 'productivity', 'cognitive'],
    contentUrl: '#',
  },
  {
    id: 'work-life-balance',
    title: 'Work-Life Balance',
    summary: 'Maintain healthy boundaries and prevent burnout',
    duration: '5 min read',
    type: 'article',
    tags: ['balance', 'boundaries', 'wellbeing'],
    contentUrl: '#',
  },
  {
    id: 'breathing-exercises',
    title: 'Breathing Exercises',
    summary: 'Quick breathing techniques to calm your mind in stressful moments',
    duration: '2 min video',
    type: 'video',
    tags: ['stress', 'mindfulness', 'quick-tips'],
    contentUrl: '#',
  },
];

export const DAILY_TIPS = [
  "Stand up and stretch for 2 minutes.",
  "Take three deep breaths before your next meeting.",
  "Drink a glass of water right now.",
  "Look away from your screen for 20 seconds.",
  "Set a boundary: no work emails after 7 PM tonight.",
  "Write down one thing you're grateful for today.",
  "Take a 5-minute walk around your space.",
  "Close your eyes and listen to the sounds around you for 1 minute.",
];