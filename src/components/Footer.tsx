import React from 'react';
import { Link } from 'react-router-dom';
import orainoLogo from '@/assets/oraino-logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src={orainoLogo} alt="Oraino" className="w-8 h-8 rounded-lg object-contain" />
              <span className="font-bold text-foreground text-lg">Oraino</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your free music streaming platform. Discover, play, and share millions of songs.
            </p>
          </div>

          {/* Discover */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3">Discover</h4>
            <ul className="space-y-2">
              <li><Link to="/discover" className="text-sm text-muted-foreground hover:text-primary transition-colors">Categories</Link></li>
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/blog/top-10-chill-songs-2026" className="text-sm text-muted-foreground hover:text-primary transition-colors">Top Chill Songs</Link></li>
              <li><Link to="/blog/best-workout-playlists" className="text-sm text-muted-foreground hover:text-primary transition-colors">Workout Playlists</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 Oraino Music. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary text-xs transition-colors">Twitter</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary text-xs transition-colors">Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary text-xs transition-colors">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
