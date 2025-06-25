
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail, Users, Linkedin } from 'lucide-react';

interface DevelopersDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const developers = [
  {
    name: 'Vipul Vadhe',
    email: 'vipulmilindvadhe@gmail.com',
    linkedin: 'https://www.linkedin.com/in/vipul-vadhe/',
    gradient: 'from-orange-500 to-pink-500',
    animation: 'animate-in fade-in-from-right-20 slide-in-from-right-20 duration-500 ease-out delay-150',
  },
  {
    name: 'Rachit Saraf',
    email: 'sararachit20@gmail.com',
    linkedin: 'https://www.linkedin.com/in/rachit-saraf-a64205365',
    gradient: 'from-blue-500 to-purple-600',
    animation: 'animate-in fade-in-from-left-20 slide-in-from-left-20 duration-500 ease-out',
  },
  {
    name: 'Dhiraj Giri',
    email: 'dhirajgiri91124@gmail.com',
    linkedin: 'http://www.linkedin.com/in/dhirajgiri18',
    gradient: 'from-green-500 to-teal-500',
    animation: 'animate-in fade-in-from-left-20 slide-in-from-left-20 duration-500 ease-out delay-300',
  },
  {
    name: 'Poonam Dhake',
    email: 'poonamdhake91@gmail.com',
    linkedin: 'https://www.linkedin.com/in/poonam-dhake',
    gradient: 'from-pink-400 to-yellow-400',
    animation: 'animate-in fade-in-from-right-20 slide-in-from-right-20 duration-500 ease-out delay-450',
  }
];

export const DevelopersDialog = ({ isOpen, onClose }: DevelopersDialogProps) => {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/70 backdrop-blur-sm border-purple-400/50 text-white rounded-4xl max-w-sm w-full p-6">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center mb-4 flex items-center justify-center gap-3">
            <Users className="h-8 w-8" />
            Meet the Developers
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {developers.map((dev, index) => (
            <div key={index} className={`p-4 rounded-2xl shadow-lg border border-white/20 bg-gradient-to-br ${dev.gradient} ${dev.animation}`}>
              <h3 className="text-lg font-bold mb-2">{dev.name}</h3>
              <div className="space-y-1">
                {dev.email && (
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${dev.email}`} className="hover:underline break-all">{dev.email}</a>
                  </div>
                )}
                {dev.linkedin && (
                    <div className="flex items-center gap-2 text-xs text-white/80">
                        <Linkedin className="h-4 w-4" />
                        <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">LinkedIn Profile</a>
                    </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
