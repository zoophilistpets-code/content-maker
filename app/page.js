'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Video,
  Mic,
  FileText,
  TrendingUp,
  Hash,
  BarChart3,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2,
  Play,
  Wand2
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: FileText,
      title: "Custom Prompt",
      description: "Transform your story ideas into engaging videos with AI-powered generation"
    },
    {
      icon: Mic,
      title: "Voice Recording",
      description: "Record your thoughts live and let AI convert them into stunning video content"
    },
    {
      icon: TrendingUp,
      title: "Sentiment Analysis",
      description: "Get deep insights into the emotional tone and impact of your content"
    },
    {
      icon: BarChart3,
      title: "Reach Prediction",
      description: "Understand your content's potential reach before publishing"
    },
    {
      icon: Hash,
      title: "Smart Hashtags",
      description: "Auto-generate trending hashtags to maximize your content visibility"
    },
    {
      icon: Sparkles,
      title: "AI Enhancement",
      description: "Intelligent optimization for better engagement and performance"
    }
  ];

  const benefits = [
    "Generate videos in minutes, not hours",
    "AI-powered sentiment analysis",
    "Smart hashtag recommendations",
    "Real-time voice to video conversion",
    "Detailed reach predictions",
    "Professional quality output"
  ];

  const { isSignedIn, isLoaded } = useUser();

  // 2. Determine destination and label based on auth state
  const destination = isSignedIn ? '/dashboard' : '/sign-in';
  const label = isSignedIn ? 'Go to Dashboard' : 'Get Started Free';

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className={`text-center space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="flex justify-center">
              <Badge className="px-4 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Video Generation
              </Badge>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Transform Ideas Into
              <span className="block mt-2 text-primary">
                Engaging Videos
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Generate professional videos from text prompts or voice recordings.
              Get instant sentiment analysis, reach predictions, and trending hashtags.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href={destination}>
                <Button size="lg" className="text-lg px-8 py-6 h-auto group">
                  {label}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto group">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
              <div className="space-y-1">
                <div className="text-3xl md:text-4xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Videos Created</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl md:text-4xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl md:text-4xl font-bold text-primary">2Min</div>
                <div className="text-sm text-muted-foreground">Avg. Generation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Input Methods Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="secondary" className="mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Two Powerful Ways
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              Choose Your Input Method
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create videos your way with flexible input options
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Custom Prompt Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
              <CardContent className="p-8 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold">Custom Prompt</h3>
                  <p className="text-muted-foreground">
                    Write your story topic or custom prompt, and our AI will transform it into a compelling video with automatic sentiment analysis and hashtag generation.
                  </p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Story-based generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Customizable narratives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Full creative control</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Voice Recording Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
              <CardContent className="p-8 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mic className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold">Live Voice Recording</h3>
                  <p className="text-muted-foreground">
                    Speak naturally and watch as your words are transcribed and transformed into engaging video content with real-time processing.
                  </p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Real-time transcription</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Natural conversation flow</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Instant video generation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="secondary" className="mb-4">
              <Wand2 className="w-4 h-4 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced AI capabilities to make your content stand out
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary">
                  <Video className="w-4 h-4 mr-2" />
                  Why Choose Us
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold">
                  Create Better Content, Faster
                </h2>
                <p className="text-xl text-muted-foreground">
                  Our AI-powered platform streamlines your video creation process while providing actionable insights to maximize engagement.
                </p>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" className="text-lg px-8 py-6 h-auto">
                Start Creating Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
              <Card className="relative border-2">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
                      <Play className="w-16 h-16 text-primary" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Sentiment</span>
                        <Badge>Positive 85%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Reach Prediction</span>
                        <Badge variant="secondary">High</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">#trending</Badge>
                        <Badge variant="outline">#viral</Badge>
                        <Badge variant="outline">#ai</Badge>
                        <Badge variant="outline">#video</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Create Amazing Videos?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of creators who are already using AI to transform their content
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={destination}>
              <Button size="lg" className="text-lg px-10 py-6 h-auto group">
                {label}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-10 py-6 h-auto">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Video className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">AI Video Gen</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 AI Video Generator. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}