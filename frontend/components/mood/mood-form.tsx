"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface MoodFormProps {
  onSubmit: (data: { moodScore: number; note?: string }) => Promise<void>;
  isLoading?: boolean;
}

export function MoodForm({ onSubmit, isLoading }: MoodFormProps) {
  const [moodScore, setMoodScore] = useState(50);
  const [note, setNote] = useState("");

  const emotions = [
    { value: 0, label: "😔", description: "Very Low" },
    { value: 25, label: "😕", description: "Low" },
    { value: 50, label: "😊", description: "Neutral" },
    { value: 75, label: "😃", description: "Good" },
    { value: 100, label: "🤗", description: "Great" },
  ];

  const currentEmotion =
    emotions.find((em) => Math.abs(moodScore - em.value) < 15) || emotions[2];

  return (
    <div className="space-y-6 py-4">
      {/* Emotion display */}
      <div className="text-center space-y-2">
        <div className="text-4xl">{currentEmotion.label}</div>
        <div className="text-sm text-muted-foreground">
          {currentEmotion.description}
        </div>
      </div>

      {/* Emotion slider */}
      <div className="space-y-4">
        <div className="flex justify-between px-2">
          {emotions.map((em) => (
            <div
              key={em.value}
              className={`cursor-pointer transition-opacity ${
                Math.abs(moodScore - em.value) < 15
                  ? "opacity-100"
                  : "opacity-50"
              }`}
              onClick={() => setMoodScore(em.value)}
            >
              <div className="text-2xl">{em.label}</div>
            </div>
          ))}
        </div>

        <Slider
          value={[moodScore]}
          onValueChange={(value) => setMoodScore(value[0])}
          min={0}
          max={100}
          step={1}
          className="py-4"
        />
      </div>

      {/* Note field */}
      <div className="space-y-2">
        <Label htmlFor="mood-note">How are you feeling? (optional)</Label>
        <Textarea
          id="mood-note"
          placeholder="Share what's on your mind..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="min-h-[80px] resize-none"
        />
      </div>

      {/* Submit button */}
      <Button
        className="w-full"
        onClick={() => onSubmit({ moodScore, note: note.trim() || undefined })}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Mood"
        )}
      </Button>
    </div>
  );
}
