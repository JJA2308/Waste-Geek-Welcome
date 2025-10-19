import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import imgImageWasteGeek from "figma:asset/7bf04d9297c3de1849586eb4c14241b1b9333379.png";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b97cbce7/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, userType: 'customer' }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Waitlist signup error:', data);
        toast.error(data.error || 'Failed to join waitlist');
        return;
      }

      toast.success(`Thanks for joining the waitlist! We'll contact you at ${email}`);
      
      setEmail('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error submitting to waitlist:', error);
      toast.error('Failed to join waitlist. Please try again.');
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#dbeafe] to-[#f8fafc] w-full border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-9 py-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate('home')}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
          </button>
          <nav className="flex gap-9">
            <button 
              onClick={() => onNavigate('home')}
              className={`font-['Inter:Regular',_sans-serif] text-[18px] tracking-[-0.4395px] hover:text-[#155dfc] transition-colors ${
                currentPage === 'home' ? 'text-[#155dfc]' : 'text-[#4a5565]'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('about')}
              className={`font-['Inter:Regular',_sans-serif] text-[18px] tracking-[-0.4395px] hover:text-[#155dfc] transition-colors ${
                currentPage === 'about' ? 'text-[#155dfc]' : 'text-[#4a5565]'
              }`}
            >
              About
            </button>
            {/* Admin button removed - access via footer truck icon */}
          </nav>
          <button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-[#155dfc] text-white px-[27px] py-2.5 rounded-[9.25px] font-['Inter:Medium',_sans-serif] text-[16px] hover:bg-[#1248c9] transition-colors"
          >
            Find a Waste Hauler
          </button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="font-['Georgia',_serif] text-[rgb(13,13,13)] text-[30.6px] text-center font-bold">
              Commercial Waste Customers! Don't get left on the curb with the trash, join the Waste Geek waitlist today!
            </DialogTitle>
            <DialogDescription className="font-['Georgia',_serif] text-[rgb(13,13,13)] text-[16px] text-center font-normal">
              Be the first to know when we launch our service!
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-[9.25px] border-2 border-[#d1d5dc] focus:border-[#155dfc] focus:outline-none font-['Inter:Regular',_sans-serif] text-[16px] text-[#101828] placeholder:text-[#9ca3af]"
              />
            </div>
            
            <button
              type="submit"
              className="bg-[#155dfc] text-white px-[27px] py-3.5 rounded-[9.25px] font-['Inter:Medium',_sans-serif] text-[20.25px] tracking-[-0.4276px] hover:bg-[#1248c9] transition-colors text-center w-[60%] mx-auto"
            >
              Join Waitlist
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}