"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Clock,
  Heart,
  Wind,
  Brain,
  Flower2,
} from "lucide-react";
import { logActivity } from "@/lib/api/activity";

interface MindfulnessSessionProps {
  type: "meditation" | "breathing" | "mindfulness" | "yoga";
  duration?: number; // in minutes
  onSessionComplete?: () => void;
}

const sessionConfigs = {
  meditation: {
    title: "Guided Meditation",
    description: "Find peace and clarity through mindful meditation",
    icon: Brain,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    defaultDuration: 10,
  },
  breathing: {
    title: "Breathing Exercise",
    description: "Calm your mind with rhythmic breathing patterns",
    icon: Wind,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    defaultDuration: 5,
  },
  mindfulness: {
    title: "Mindfulness Practice",
    description: "Cultivate present-moment awareness",
    icon: Heart,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    defaultDuration: 15,
  },
  yoga: {
    title: "Mindful Yoga",
    description: "Connect body and mind through gentle movement",
    icon: Flower2,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    defaultDuration: 20,
  },
};

export function MindfulnessSession({
  type,
  duration,
  onSessionComplete,
}: MindfulnessSessionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(
    (duration || sessionConfigs[type].defaultDuration) * 60
  );
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);

  const config = sessionConfigs[type];
  const totalDuration = (duration || sessionConfigs[type].defaultDuration) * 60;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          setProgress(((totalDuration - newTime) / totalDuration) * 100);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      // Session completed
      handleSessionComplete();
    }

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, totalDuration]);

  const handleSessionComplete = async () => {
    setIsPlaying(false);

    // Log the session as an activity
    try {
      await logActivity({
        type,
        name: config.title,
        description: `Completed ${Math.round(
          totalDuration / 60
        )} minute ${type} session`,
        duration: Math.round(totalDuration / 60),
        completed: true,
      });
    } catch (error) {
      console.error("Error logging mindfulness session:", error);
    }

    onSessionComplete?.();
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const resetSession = () => {
    setIsPlaying(false);
    setTimeLeft(totalDuration);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const IconComponent = config.icon;

  return (
    <Card className="border-primary/10">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${config.bgColor}`}>
            <IconComponent className={`w-6 h-6 ${config.color}`} />
          </div>
          <div>
            <CardTitle className="text-xl">{config.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {config.description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center space-y-4">
          <div className="text-4xl font-mono font-bold text-primary">
            {formatTime(timeLeft)}
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-sm text-muted-foreground">
            {Math.round(progress)}% complete
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>

          <Button
            size="lg"
            onClick={togglePlay}
            className="rounded-full w-16 h-16"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </Button>

          <Button variant="outline" size="sm" onClick={resetSession}>
            <Square className="w-4 h-4" />
          </Button>
        </div>

        {/* Volume Control */}
        {!isMuted && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Volume</span>
            </div>
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        )}

        {/* Session Tips */}
        <div className="p-4 rounded-lg bg-primary/5 space-y-2">
          <h4 className="font-medium text-sm">Session Tips</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {type === "meditation" && (
              <>
                <li>• Find a comfortable, quiet space</li>
                <li>• Focus on your breath and let thoughts pass</li>
                <li>• Don't judge your thoughts, just observe them</li>
              </>
            )}
            {type === "breathing" && (
              <>
                <li>• Breathe naturally, don't force it</li>
                <li>• Follow the visual guide for rhythm</li>
                <li>• Relax your shoulders and jaw</li>
              </>
            )}
            {type === "mindfulness" && (
              <>
                <li>• Notice your surroundings without judgment</li>
                <li>• Pay attention to your body sensations</li>
                <li>• Stay present in the moment</li>
              </>
            )}
            {type === "yoga" && (
              <>
                <li>• Move slowly and mindfully</li>
                <li>• Listen to your body's limits</li>
                <li>• Focus on your breath with each movement</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
