import api from "../api";

export const saveMood = async (
  score: number,
  note: string = "",
  context?: any,
  activities?: any[]
) => {
  const { data } = await api.post("/api/mood", {
    score,
    note,
    context,
    activities,
  });
  return data.data; // backend responds { success, data: mood }
};

export const getMoodHistory = async (days: number = 7) => {
  const { data } = await api.get(`/api/mood/history?days=${days}`);
  return data.moods;
};

export const getTodaysMood = async () => {
  const { data } = await api.get(`/api/mood/today`);
  return data.moods;
};
