"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Brain,
  Wind,
  Heart,
  Flower2,
  Play,
  Plus,
  Target,
  Clock,
  Award,
} from "lucide-react";
import { MindfulnessTracker } from "./mindfulness-tracker";
import { MindfulnessSession } from "./mindfulness-session";

const quickSessions = [
  {
    type: "breathing" as const,
    duration: 5,
    title: "Quick Breathing",
    description: "5-minute breathing exercise",
    icon: Wind,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    type: "meditation" as const,
    duration: 10,
    title: "Short Meditation",
    description: "10-minute guided meditation",
    icon: Brain,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    type: "mindfulness" as const,
    duration: 15,
    title: "Mindfulness Practice",
    description: "15-minute mindfulness session",
    icon: Heart,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    type: "yoga" as const,
    duration: 20,
    title: "Gentle Yoga",
    description: "20-minute mindful yoga",
    icon: Flower2,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
];

export function MindfulnessDashboard() {
  const [showSession, setShowSession] = useState(false);
  const [selectedSession, setSelectedSession] = useState<
    (typeof quickSessions)[0] | null
  >(null);
  const [showCustomSession, setShowCustomSession] = useState(false);

  const handleStartSession = (session: (typeof quickSessions)[0]) => {
    setSelectedSession(session);
    setShowSession(true);
  };

  const handleSessionComplete = () => {
    setShowSession(false);
    setSelectedSession(null);
    // The session completion is handled by the MindfulnessSession component
  };

  return (
    <div className="space-y-6">
      {/* Quick Start Sessions */}
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-primary" />
            Quick Start Sessions
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Begin your mindfulness journey with guided sessions
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickSessions.map((session) => {
              const IconComponent = session.icon;
              return (
                <motion.div
                  key={session.type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-3 hover:border-primary/50"
                    onClick={() => handleStartSession(session)}
                  >
                    <div className={`p-3 rounded-lg ${session.bgColor}`}>
                      <IconComponent className={`w-6 h-6 ${session.color}`} />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm">{session.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {session.description}
                      </div>
                    </div>
                  </Button>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowCustomSession(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Custom Session
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mindfulness Tracker */}
      <MindfulnessTracker />

      {/* Session Dialog */}
      <Dialog open={showSession} onOpenChange={setShowSession}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Mindfulness Session</DialogTitle>
            <DialogDescription>
              Take a moment to focus on your wellbeing
            </DialogDescription>
          </DialogHeader>
          {selectedSession && (
            <MindfulnessSession
              type={selectedSession.type}
              duration={selectedSession.duration}
              onSessionComplete={handleSessionComplete}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Custom Session Dialog */}
      <Dialog open={showCustomSession} onOpenChange={setShowCustomSession}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Custom Mindfulness Session</DialogTitle>
            <DialogDescription>
              Choose your own mindfulness practice
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {quickSessions.map((session) => {
                const IconComponent = session.icon;
                return (
                  <Button
                    key={session.type}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-3"
                    onClick={() => {
                      setSelectedSession(session);
                      setShowCustomSession(false);
                      setShowSession(true);
                    }}
                  >
                    <div className={`p-3 rounded-lg ${session.bgColor}`}>
                      <IconComponent className={`w-6 h-6 ${session.color}`} />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm">{session.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {session.duration} minutes
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
