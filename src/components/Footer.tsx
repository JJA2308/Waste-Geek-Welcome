import { Truck } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <div className="bg-gray-50 border-t border-gray-200 py-9">
      <div className="max-w-7xl mx-auto px-9">
        <div className="flex items-center justify-center gap-4">
          <p className="font-['Inter:Regular',_sans-serif] text-[#4a5565] text-[18px] tracking-[-0.4395px] text-center">
            © 2025 Waste Geek LLC. All rights reserved.
          </p>
          <button
            onClick={() => onNavigate('admin-login')}
            className="absolute right-[10%] text-[#4a5565] hover:text-[#155dfc] p-2 transition-all hover:scale-110"
            aria-label="Navigate to admin dashboard"
          >
            <Truck className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}