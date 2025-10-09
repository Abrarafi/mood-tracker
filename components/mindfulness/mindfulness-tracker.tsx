"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Brain,
  Heart,
  Wind,
  Flower2,
  TreePine,
  Waves,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  Sparkles,
  Book,
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
  differenceInMinutes,
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

const mindfulnessTypes = [
  "meditation",
  "breathing",
  "mindfulness",
  "recitation",
  "game",
];

const getMindfulnessIcon = (type: string) => {
  switch (type) {
    case "meditation":
      return Brain;
    case "breathing":
      return Wind;
    case "mindfulness":
      return Heart;
    case "recitation":
      return Book;
    case "game":
      return Sparkles;
    default:
      return Target;
  }
};

const getMindfulnessColor = (type: string) => {
  switch (type) {
    case "meditation":
      return "text-purple-500";
    case "breathing":
      return "text-blue-500";
    case "mindfulness":
      return "text-rose-500";
    case "recitation":
      return "text-green-500";
    case "game":
      return "text-yellow-500";
    default:
      return "text-gray-500";
  }
};

export function MindfulnessTracker() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">(
    "week"
  );

  useEffect(() => {
    const loadMindfulnessData = async () => {
      try {
        const userActivities = await getUserActivities(30);
        setActivities(userActivities);
      } catch (error) {
        console.error("Error loading mindfulness data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMindfulnessData();
  }, []);

  // Process mindfulness activities
  const processMindfulnessData = () => {
    const mindfulnessActivities = activities.filter((activity) =>
      mindfulnessTypes.includes(activity.type)
    );

    const periods = selectedPeriod === "week" ? 7 : 30;
    const startDate = startOfDay(subDays(new Date(), periods - 1));

    const dailyData = Array.from({ length: periods }, (_, i) => {
      const day = startOfDay(addDays(startDate, i));
      const dayActivities = mindfulnessActivities.filter((activity) =>
        isWithinInterval(new Date(activity.timestamp), {
          start: day,
          end: addDays(day, 1),
        })
      );

      const totalDuration = dayActivities.reduce(
        (acc, activity) => acc + (activity.duration || 0),
        0
      );

      return {
        date: day,
        day: format(day, selectedPeriod === "week" ? "EEE" : "MMM dd"),
        activities: dayActivities,
        duration: totalDuration,
        count: dayActivities.length,
      };
    });

    return dailyData;
  };

  const mindfulnessData = processMindfulnessData();

  // Calculate insights
  const calculateInsights = () => {
    const insights = [];
    const mindfulnessActivities = activities.filter((activity) =>
      mindfulnessTypes.includes(activity.type)
    );

    if (mindfulnessActivities.length > 0) {
      const last7Days = mindfulnessActivities.filter(
        (activity) =>
          new Date(activity.timestamp) >= startOfDay(subDays(new Date(), 7))
      );

      const totalDuration = last7Days.reduce(
        (acc, activity) => acc + (activity.duration || 0),
        0
      );

      // Streak calculation
      let currentStreak = 0;
      const today = startOfDay(new Date());
      for (let i = 0; i < 30; i++) {
        const checkDate = startOfDay(subDays(today, i));
        const hasActivity = mindfulnessActivities.some((activity) =>
          isWithinInterval(new Date(activity.timestamp), {
            start: checkDate,
            end: addDays(checkDate, 1),
          })
        );
        if (hasActivity) {
          currentStreak++;
        } else {
          break;
        }
      }

      if (currentStreak > 0) {
        insights.push({
          title: "Mindfulness Streak",
          description: `${currentStreak} days in a row! Keep it up!`,
          icon: Award,
          color: "text-green-500",
        });
      }

      if (totalDuration > 0) {
        const avgDuration = totalDuration / last7Days.length;
        insights.push({
          title: "Average Session",
          description: `${Math.round(avgDuration)} minutes per session`,
          icon: Clock,
          color: "text-blue-500",
        });
      }

      // Activity type distribution
      const typeCounts = mindfulnessActivities.reduce((acc, activity) => {
        acc[activity.type] = (acc[activity.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mostPopular = Object.entries(typeCounts).reduce((a, b) =>
        typeCounts[a[0]] > typeCounts[b[0]] ? a : b
      );

      if (mostPopular) {
        insights.push({
          title: "Favorite Practice",
          description: `${mostPopular[0]} is your most practiced activity`,
          icon: getMindfulnessIcon(mostPopular[0]),
          color: getMindfulnessColor(mostPopular[0]),
        });
      }
    }

    return insights;
  };

  const insights = calculateInsights();

  // Calculate totals
  const totalMindfulnessActivities = activities.filter((activity) =>
    mindfulnessTypes.includes(activity.type)
  ).length;

  const totalDuration = activities
    .filter((activity) => mindfulnessTypes.includes(activity.type))
    .reduce((acc, activity) => acc + (activity.duration || 0), 0);

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
              Mindfulness Journey
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Track your mindfulness and meditation practices
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("week")}
            >
              Week
            </Button>
            <Button
              variant={selectedPeriod === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("month")}
            >
              Month
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-primary/5">
            <div className="text-2xl font-bold text-primary">
              {totalMindfulnessActivities}
            </div>
            <div className="text-sm text-muted-foreground">Sessions</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-primary/5">
            <div className="text-2xl font-bold text-primary">
              {Math.round(totalDuration)}
            </div>
            <div className="text-sm text-muted-foreground">Minutes</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-primary/5">
            <div className="text-2xl font-bold text-primary">
              {totalDuration > 0
                ? Math.round(totalDuration / totalMindfulnessActivities)
                : 0}
            </div>
            <div className="text-sm text-muted-foreground">Avg Duration</div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            {selectedPeriod === "week" ? "Weekly" : "Monthly"} Activity
          </h4>
          <div className="h-[200px] flex items-end justify-between">
            {mindfulnessData.map((day, index) => (
              <div
                key={day.day}
                className="flex flex-col items-center space-y-2 group"
              >
                <div className="relative w-12 cursor-pointer">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{
                      height: `${Math.min((day.duration / 60) * 2, 100)}%`,
                    }}
                    transition={{ delay: index * 0.1 }}
                    className="w-8 rounded-full bg-gradient-to-t from-primary/20 to-primary/30 group-hover:from-primary/30 group-hover:to-primary/40 transition-all absolute bottom-0 left-1/2 -translate-x-1/2"
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Heart className="w-4 h-4 text-primary" />
                    </div>
                  </motion.div>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {day.day}
                </span>
                <div className="text-xs text-center">
                  <div className="font-medium">{day.count}</div>
                  <div className="text-muted-foreground">{day.duration}m</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Insights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-primary/5 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <insight.icon className={`w-4 h-4 ${insight.color}`} />
                    <h5 className="font-medium">{insight.title}</h5>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {insight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activities */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Recent Sessions
          </h4>
          <div className="space-y-2">
            {activities
              .filter((activity) => mindfulnessTypes.includes(activity.type))
              .slice(0, 5)
              .map((activity) => {
                const IconComponent = getMindfulnessIcon(activity.type);
                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-primary/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IconComponent className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{activity.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(
                            new Date(activity.timestamp),
                            "MMM dd, h:mm a"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {activity.duration ? `${activity.duration}m` : "N/A"}
                      </div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {activity.type}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
