import api from "../api";

export interface ActivityData {
  type: string;
  name: string;
  description?: string;
  duration?: number;
  difficulty?: "easy" | "medium" | "hard";
  feedback?: string;
  completed?: boolean;
  moodScore?: number;
  moodNote?: string;
}

export interface Activity {
  id: string;
  userId: string | null;
  type: string;
  name: string;
  description: string | null;
  timestamp: Date;
  duration: number | null;
  completed: boolean;
  moodScore: number | null;
  moodNote: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const logActivity = async (
  activityData: ActivityData
): Promise<Activity> => {
  const { data } = await api.post("/api/activity", activityData);
  const activity = data.data;
  return {
    id: activity._id,
    userId: activity.userId || null,
    type: activity.type,
    name: activity.name,
    description: activity.description ?? null,
    timestamp: new Date(activity.timestamp),
    duration: activity.duration ?? null,
    completed: activity.completed,
    moodScore: activity.moodScore ?? null,
    moodNote: activity.moodNote ?? null,
    createdAt: new Date(activity.createdAt),
    updatedAt: new Date(activity.updatedAt),
  };
};

export const getUserActivities = async (
  days: number = 30
): Promise<Activity[]> => {
  const { data } = await api.get(`/api/activity?days=${days}`);
  return data.data.map((activity: any) => ({
    id: activity._id,
    userId: activity.userId || null,
    type: activity.type,
    name: activity.name,
    description: activity.description ?? null,
    timestamp: new Date(activity.timestamp),
    duration: activity.duration ?? null,
    completed: activity.completed,
    moodScore: activity.moodScore ?? null,
    moodNote: activity.moodNote ?? null,
    createdAt: new Date(activity.createdAt),
    updatedAt: new Date(activity.updatedAt),
  }));
};

export const updateActivityStatus = async (
  activityId: string,
  updates: { completed?: boolean; moodScore?: number; moodNote?: string }
): Promise<Activity> => {
  const { data } = await api.put(`/api/activity/${activityId}`, updates);
  const activity = data.data;
  return {
    id: activity._id,
    userId: activity.userId || null,
    type: activity.type,
    name: activity.name,
    description: activity.description ?? null,
    timestamp: new Date(activity.timestamp),
    duration: activity.duration ?? null,
    completed: activity.completed,
    moodScore: activity.moodScore ?? null,
    moodNote: activity.moodNote ?? null,
    createdAt: new Date(activity.createdAt),
    updatedAt: new Date(activity.updatedAt),
  };
};
