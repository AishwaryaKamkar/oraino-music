import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Heart, Clock } from 'lucide-react';

const MobileNav: React.FC = () => {
  const links = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/library', icon: Library, label: 'Library' },
    { to: '/favorites', icon: Heart, label: 'Likes' },
    { to: '/history', icon: Clock, label: 'History' },
  ];

  return (
    <nav className="md:hidden fixed bottom-[72px] left-0 right-0 z-40 glass border-t border-border">
      <div className="flex justify-around py-2">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
