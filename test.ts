"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Brain,
  Heart,
  Shield,
  MessageCircle,
  Sparkles,
  LineChart,
  Waves,
  Check,
  ArrowRight,
  HeartPulse,
  Lightbulb,
  Lock,
  MessageSquareHeart,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import React from "react";
import { Ripple } from "@/components/ui/ripple";
import { useAuth } from "@/lib/contexts/auth-context";

export default function Home() {
  const emotions = [
    { value: 0, label: "😔 Down", color: "from-blue-500/50" },
    { value: 25, label: "�� Content", color: "from-green-500/50" },
    { value: 50, label: "😌 Peaceful", color: "from-purple-500/50" },
    { value: 75, label: "🤗 Happy", color: "from-yellow-500/50" },
    { value: 100, label: "✨ Excited", color: "from-pink-500/50" },
  ];

  const [emotion, setEmotion] = useState(50);
  const [mounted, setMounted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { isAuthenticated, setShowLoginModal } = useAuth();

  const welcomeSteps = [
    {
      title: "Hi, I'm Aura 👋",
      description: "I'm your AI-powered mental wellness companion. I'm here to help you track your emotions, understand your patterns, and guide you toward better mental health.",
      icon: <Brain className="w-8 h-8 text-primary" />,
    },
    {
      title: "Track Your Moods 📊",
      description: "Log your daily emotions and see patterns over time. Understanding your emotional journey is the first step toward wellness.",
      icon: <LineChart className="w-8 h-8 text-primary" />,
    },
    {
      title: "Get Personalized Insights 🧠",
      description: "Receive AI-powered insights and recommendations based on your mood patterns and personal goals.",
      icon: <Lightbulb className="w-8 h-8 text-primary" />,
    },
    {
      title: "Secure & Private 🔒",
      description: "Your data is encrypted and private. Your mental health journey is personal, and we respect that completely.",
      icon: <Shield className="w-8 h-8 text-primary" />,
    },
    {
      title: "Ready to Begin? 🚀",
      description: "Let's start your journey toward better mental wellness. Remember, every step forward is progress.",
      icon: <HeartPulse className="w-8 h-8 text-primary" />,
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLetsBegin = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    // If authenticated, proceed with the original logic
    setShowDialog(false);
    setCurrentStep(0);
    // Here you would navigate to the chat interface
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
              >
                <Sparkles className="w-4 h-4" />
                AI-Powered Mental Wellness
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Your Mental Health
                <br />
                <span className="text-primary">Companion</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Track your emotions, discover patterns, and get personalized insights 
                to improve your mental wellness journey.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                size="lg"
                className="group relative px-8 py-4 text-lg font-semibold hover-lift gentle-shadow"
                onClick={() => setShowDialog(true)}
              >
                <span className="flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <Ripple />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold hover-lift"
                asChild
              >
                <Link href="/about">
                  <span className="flex items-center gap-2">
                    Learn More
                    <MessageCircle className="w-5 h-5" />
                  </span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Why Choose <span className="text-primary">Aura</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of mental wellness with AI-powered insights and personalized care.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8 text-primary" />,
                title: "AI-Powered Insights",
                description: "Get personalized recommendations based on your mood patterns and personal goals.",
                color: "from-primary/20 to-primary/5",
              },
              {
                icon: <LineChart className="w-8 h-8 text-primary" />,
                title: "Mood Tracking",
                description: "Track your emotions daily and visualize patterns over time with beautiful charts.",
                color: "from-secondary/20 to-secondary/5",
              },
              {
                icon: <Shield className="w-8 h-8 text-primary" />,
                title: "Privacy First",
                description: "Your data is encrypted and secure. Your mental health journey is completely private.",
                color: "from-accent/20 to-accent/5",
              },
              {
                icon: <MessageSquareHeart className="w-8 h-8 text-primary" />,
                title: "24/7 Support",
                description: "Access your AI companion anytime, anywhere. Mental wellness support when you need it.",
                color: "from-primary/20 to-primary/5",
              },
              {
                icon: <Heart className="w-8 h-8 text-primary" />,
                title: "Personalized Care",
                description: "Receive tailored recommendations and exercises based on your unique needs and preferences.",
                color: "from-secondary/20 to-secondary/5",
              },
              {
                icon: <Waves className="w-8 h-8 text-primary" />,
                title: "Mindfulness Tools",
                description: "Access guided meditations, breathing exercises, and mindfulness practices.",
                color: "from-accent/20 to-accent/5",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover-lift gentle-shadow group border-0 bg-gradient-to-br from-background to-card/50">
                  <CardHeader className="space-y-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">
                Try It Out
              </h2>
              <p className="text-xl text-muted-foreground">
                Experience how easy it is to track your mood with our intuitive interface.
              </p>
            </div>

            <Card className="p-8 max-w-2xl mx-auto gentle-shadow">
              <CardContent className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-semibold">How are you feeling today?</h3>
                  <p className="text-muted-foreground">
                    Move the slider to indicate your current mood
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="px-4">
                    <Slider
                      value={[emotion]}
                      onValueChange={(value) => setEmotion(value[0])}
                      max={100}
                      step={25}
                      className="w-full"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    {emotions.map((emotionItem, index) => (
                      <motion.div
                        key={index}
                        className={`text-center space-y-2 ${
                          Math.abs(emotion - emotionItem.value) <= 12.5
                            ? "scale-110 text-primary font-semibold"
                            : "opacity-60"
                        }`}
                        animate={{
                          scale: Math.abs(emotion - emotionItem.value) <= 12.5 ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="text-2xl">{emotionItem.label.split(" ")[0]}</div>
                        <div className="text-sm text-muted-foreground">
                          {emotionItem.label.split(" ").slice(1).join(" ")}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    className="text-center p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10"
                    animate={{
                      background: `linear-gradient(to right, ${emotions.find(e => Math.abs(emotion - e.value) <= 12.5)?.color || "from-primary/10"}, to-secondary/10)`,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-lg font-medium">
                      {emotions.find(e => Math.abs(emotion - e.value) <= 12.5)?.label || "Select your mood"}
                    </p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Start Your
                <br />
                <span className="text-primary">Wellness Journey</span>?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of users who are already improving their mental health with Aura.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="group relative px-8 py-4 text-lg font-semibold hover-lift gentle-shadow"
                onClick={() => setShowDialog(true)}
              >
                <span className="flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <Ripple />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold hover-lift"
                asChild
              >
                <Link href="/about">
                  <span className="flex items-center gap-2">
                    Learn More
                    <MessageCircle className="w-5 h-5" />
                  </span>
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Welcome Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                {welcomeSteps[currentStep].icon}
              </div>
              <DialogTitle className="text-2xl font-bold">
                {welcomeSteps[currentStep].title}
              </DialogTitle>
              <DialogDescription className="text-lg text-muted-foreground leading-relaxed">
                {welcomeSteps[currentStep].description}
              </DialogDescription>
            </div>

            <div className="flex justify-center space-x-2">
              {welcomeSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <Button
              onClick={() => {
                if (currentStep < welcomeSteps.length - 1) {
                  setCurrentStep((c) => c + 1);
                } else {
                  handleLetsBegin();
                }
              }}
              className="relative group px-6"
            >
              <span className="flex items-center gap-2">
                {currentStep === welcomeSteps.length - 1 ? (
                  <>
                    Let's Begin
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add custom animations to globals.css */}
    </div>
  );
}
