"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Brain,
  TrendingUp,
  Calendar,
  Activity,
  Medal,
  Target,
  Smile,
  Frown,
  Meh,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getUserActivities } from "@/lib/api/activity";
import {
  format,
  startOfDay,
  subDays,
  isWithinInterval,
  addDays,
} from "date-fns";

interface Activity {
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

const getMoodEmoji = (value: number) => {
  if (value >= 80) return { icon: Smile, color: "text-green-500" };
  if (value >= 60) return { icon: Meh, color: "text-yellow-500" };
  return { icon: Frown, color: "text-red-500" };
};

const getMoodColor = (value: number) => {
  if (value >= 80) return "from-green-500/20 to-green-500/30";
  if (value >= 60) return "from-yellow-500/20 to-yellow-500/30";
  return "from-red-500/20 to-red-500/30";
};

export function MoodTracker() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMoodData = async () => {
      try {
        const userActivities = await getUserActivities(30);
        setActivities(userActivities);
      } catch (error) {
        console.error("Error loading mood data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMoodData();
  }, []);

  // Process activities into daily mood data
  const processMoodData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) =>
      startOfDay(subDays(new Date(), 6 - i))
    );

    return last7Days.map((day, index) => {
      const dayActivities = activities.filter((activity) =>
        isWithinInterval(new Date(activity.timestamp), {
          start: day,
          end: addDays(day, 1),
        })
      );

      // Get mood entries for this day
      const moodEntries = dayActivities.filter(
        (a) => a.type === "mood" && a.moodScore !== null
      );

      // Calculate average mood for the day
      const averageMood =
        moodEntries.length > 0
          ? Math.round(
              moodEntries.reduce(
                (acc, curr) => acc + (curr.moodScore || 0),
                0
              ) / moodEntries.length
            )
          : null;

      // Get other activities for this day
      const otherActivities = dayActivities.filter((a) => a.type !== "mood");

      return {
        day: format(day, "EEE"),
        value: averageMood || 0,
        hasData: averageMood !== null,
        activities: otherActivities.map((activity) => ({
          name: activity.name,
          duration: activity.duration ? `${activity.duration}min` : "N/A",
          impact:
            activity.type === "game" || activity.type === "meditation"
              ? "positive"
              : "neutral",
        })),
        moodEntries: moodEntries.map((entry) => ({
          score: entry.moodScore,
          note: entry.moodNote,
          time: format(new Date(entry.timestamp), "h:mm a"),
        })),
      };
    });
  };

  const moodData = processMoodData();

  // Calculate insights
  const calculateInsights = () => {
    const insights = [];
    const moodEntries = activities.filter(
      (a) => a.type === "mood" && a.moodScore !== null
    );

    if (moodEntries.length >= 2) {
      const recentMoods = moodEntries.slice(-7); // Last 7 mood entries
      const averageMood =
        recentMoods.reduce((acc, curr) => acc + (curr.moodScore || 0), 0) /
        recentMoods.length;
      const latestMood = recentMoods[recentMoods.length - 1].moodScore || 0;

      if (latestMood > averageMood + 10) {
        insights.push({
          title: "Mood Improvement",
          description: "Your recent mood scores are trending upward!",
          trend: "up",
        });
      } else if (latestMood < averageMood - 15) {
        insights.push({
          title: "Mood Support",
          description: "Consider trying some mood-lifting activities.",
          trend: "down",
        });
      }

      // Activity correlation
      const mindfulnessActivities = activities.filter((a) =>
        ["game", "meditation", "breathing"].includes(a.type)
      );
      if (mindfulnessActivities.length > 0) {
        insights.push({
          title: "Activity Impact",
          description:
            "Your mindfulness activities are helping your wellbeing.",
          trend: "up",
        });
      }
    }

    return insights;
  };

  const insights = calculateInsights();

  if (loading) {
    return (
      <Card className="border-primary/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Mood Insights
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Your emotional journey over time
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Week
            </Button>
            <Button variant="ghost" size="sm">
              Month
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Daily Mood Chart */}
        <div className="space-y-4">
          <div className="h-[200px] flex items-end justify-between">
            {moodData.map((day, index) => (
              <div
                key={day.day}
                className="flex flex-col items-center space-y-2 group"
                onClick={() =>
                  setSelectedDay(selectedDay === index ? null : index)
                }
              >
                <AnimatePresence>
                  {selectedDay === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute -top-4 left-1/2 -translate-x-1/2 bg-popover/95 p-4 rounded-lg shadow-lg w-64 space-y-3 backdrop-blur-sm border border-border z-10"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{day.day}'s Mood</h4>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4 text-primary" />
                          <span className="text-sm">{day.value}%</span>
                        </div>
                      </div>

                      {day.moodEntries.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">Mood Entries</h5>
                          {day.moodEntries.map((entry, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-2 rounded-lg bg-background"
                            >
                              <div className="flex items-center gap-2">
                                <div className="text-lg">
                                  {React.createElement(
                                    getMoodEmoji(entry.score || 0).icon,
                                    {
                                      className: `w-4 h-4 ${
                                        getMoodEmoji(entry.score || 0).color
                                      }`,
                                    }
                                  )}
                                </div>
                                <span className="text-sm font-medium">
                                  {entry.score}%
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {entry.time}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {day.activities.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">Activities</h5>
                          {day.activities.map((activity, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-2 rounded-lg bg-background"
                            >
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-md bg-primary/10">
                                  <Activity className="w-3 h-3 text-primary" />
                                </div>
                                <span className="text-sm font-medium">
                                  {activity.name}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {activity.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {day.moodEntries.length === 0 &&
                        day.activities.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-2">
                            No data for this day
                          </p>
                        )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative w-12 cursor-pointer">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${day.hasData ? day.value : 0}%` }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-8 rounded-full bg-gradient-to-t ${getMoodColor(
                      day.value
                    )} group-hover:opacity-80 transition-all absolute bottom-0 left-1/2 -translate-x-1/2 ${
                      selectedDay === index ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    {day.hasData && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        {React.createElement(getMoodEmoji(day.value).icon, {
                          className: `w-4 h-4 ${getMoodEmoji(day.value).color}`,
                        })}
                      </div>
                    )}
                  </motion.div>
                </div>
                <span
                  className={`text-sm font-medium transition-colors ${
                    selectedDay === index
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights Grid */}
        {insights.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-primary/5 space-y-2"
              >
                <div className="flex items-center gap-2">
                  {insight.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <LineChart className="w-4 h-4 text-yellow-500" />
                  )}
                  <h4 className="font-medium">{insight.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Current Mood Summary */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              This Week's Mood
            </h4>
            <p className="text-sm text-muted-foreground">
              Average:{" "}
              {Math.round(
                moodData.reduce((acc, day) => acc + day.value, 0) /
                  moodData.length
              )}
              %
            </p>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {moodData.map((day) => (
              <div
                key={day.day}
                className={`p-2 rounded-lg text-center ${
                  day.hasData ? "bg-primary/5" : "bg-muted/20"
                }`}
              >
                <p className="text-sm font-medium">{day.day}</p>
                <p className="text-xs text-muted-foreground">
                  {day.hasData ? `${day.value}%` : "No data"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
