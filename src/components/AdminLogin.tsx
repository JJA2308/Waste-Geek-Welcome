import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { Lock, Check } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [showCheck, setShowCheck] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if password is exactly 8 letters (any English word)
    const isValid8LetterWord = /^[a-zA-Z]{8}$/.test(password);
    
    if (isValid8LetterWord) {
      setShowCheck(true);
      setTimeout(() => {
        onLogin();
      }, 800);
    } else {
      toast.error('Access Denied!');
      setPassword('');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#dbeafe] to-[#f8fafc] px-4 py-12 relative">
      {/* Green check in upper left corner */}
      {showCheck && (
        <div className="fixed top-8 left-8 bg-green-500 rounded-full p-3 shadow-lg animate-in fade-in zoom-in duration-300">
          <Check className="size-8 text-white" />
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#155dfc] p-4 rounded-full mb-4">
            <Lock className="size-8 text-white" />
          </div>
          <h1 className="font-['Georgia',_serif] text-[#0d0d0d] text-center">
            Admin Access
          </h1>
          <p className="font-['Inter:Regular',_sans-serif] text-[#4a5565] text-center mt-2">
            Enter password to access the dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-[9.25px] border-2 border-[#d1d5dc] focus:border-[#155dfc] focus:outline-none font-['Inter:Regular',_sans-serif] text-[16px] text-[#101828] placeholder:text-[#9ca3af]"
              autoFocus
            />
          </div>
          
          <button
            type="submit"
            className="bg-[#155dfc] text-white px-[27px] py-3 rounded-[9.25px] font-['Inter:Medium',_sans-serif] text-[16px] hover:bg-[#1248c9] transition-colors"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}