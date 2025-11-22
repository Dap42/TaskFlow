"use client";

import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, Target, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const slides = [
  {
    icon: Sparkles,
    title: "Welcome to TaskFlow",
    description: "The smart way to manage your tasks with AI-powered insights and beautiful design.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Target,
    title: "Stay Organized",
    description: "Smart prioritization, deadline tracking, and category organization keep you on track.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: CheckCircle2,
    title: "Track Progress",
    description: "Visual dashboards, subtasks, and real-time analytics show your productivity.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Rocket,
    title: "Get Started",
    description: "Create your first task and experience the future of task management!",
    gradient: "from-green-500 to-emerald-500",
  },
];

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <Card className="border-2 shadow-2xl">
                  <CardContent className="p-12 text-center space-y-6">
                    <div
                      className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${slide.gradient} rounded-2xl mb-4`}
                    >
                      <slide.icon className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {slide.title}
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
                      {slide.description}
                    </p>
                    <div className="flex gap-1 justify-center mt-8">
                      {slides.map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 rounded-full transition-all ${
                            i === index
                              ? "w-8 bg-primary"
                              : "w-2 bg-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    {index === slides.length - 1 && (
                      <Button
                        size="lg"
                        onClick={onComplete}
                        className="mt-6"
                      >
                        Let's Go!
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-12" />
          <CarouselNext className="-right-12" />
        </Carousel>
        
        <div className="text-center mt-4">
          <button
            onClick={onComplete}
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Skip tutorial
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
