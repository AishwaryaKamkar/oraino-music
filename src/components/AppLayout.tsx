import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import PlayerBar from '@/components/PlayerBar';
import { usePlayer } from '@/context/PlayerContext';

const AppLayout: React.FC = () => {
  const { currentSong } = usePlayer();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className={`flex-1 overflow-y-auto ${currentSong ? 'pb-36 md:pb-28' : 'pb-20 md:pb-0'}`}>
        <Outlet />
      </main>
      <MobileNav />
      <PlayerBar />
    </div>
  );
};

export default AppLayout;
