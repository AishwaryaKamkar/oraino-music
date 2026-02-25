import React from 'react';
import { Music, Headphones, Users, Globe } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">About Oraino Music</h1>

      <div className="prose prose-invert max-w-none space-y-6 text-secondary-foreground leading-relaxed">
        <p>
          Oraino Music is a free, modern music streaming platform built for music lovers everywhere. Whether you're studying, working out, coding, or just relaxing — Oraino brings millions of songs to your fingertips with zero cost.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          {[
            { icon: Music, label: 'Millions of Songs' },
            { icon: Headphones, label: 'High Quality Audio' },
            { icon: Users, label: 'Growing Community' },
            { icon: Globe, label: 'Available Worldwide' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-4 text-center">
              <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">{label}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
        <p>
          We believe music should be accessible to everyone. Oraino Music provides a seamless, ad-supported streaming experience that lets you discover new artists, create playlists, save your favorites, and share music with friends — all completely free.
        </p>

        <h2 className="text-2xl font-bold text-foreground">What Makes Us Different</h2>
        <p>
          Unlike other platforms, Oraino is designed with a mobile-first approach. Our clean, intuitive interface works beautifully on every device — from iPhones to Android phones, tablets to desktops. We focus on speed, simplicity, and discovery.
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Curated categories: Study, Coding, Workout, Party, Relax, Focus</li>
          <li>Personalized recommendations based on your listening habits</li>
          <li>Social sharing to WhatsApp, Facebook, and Instagram</li>
          <li>Create unlimited playlists and save favorites</li>
          <li>PWA support — install Oraino directly to your home screen</li>
        </ul>

        <h2 className="text-2xl font-bold text-foreground">Our Story</h2>
        <p>
          Oraino Music was founded in 2026 with a simple idea: great music should be free and easy to access. We aggregate content from multiple sources including YouTube and Jamendo to provide a diverse catalog spanning every genre and mood. Our platform is continuously evolving with new features, better recommendations, and an ever-growing library.
        </p>

        <p>
          Thank you for being part of the Oraino community. We're just getting started, and we're thrilled to have you along for the ride. 🎶
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
