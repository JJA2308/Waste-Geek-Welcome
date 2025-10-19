import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import svgPaths from "../imports/svg-cp7lk6nsuy";
import imgImageWasteGeek from "figma:asset/7bf04d9297c3de1849586eb4c14241b1b9333379.png";
import imgImageProfessionalWasteManagementIllustration from "figma:asset/676eeee899b0f47cf5c7bc14e73d3a90564f40a1.png";

export function HomePage() {
  const [userType, setUserType] = useState<'customer' | 'hauler' | 'broker' | ''>('');
  const [email, setEmail] = useState('');
  const [haulerBrokerType, setHaulerBrokerType] = useState<'hauler' | 'broker' | ''>('');
  const [haulerBrokerEmail, setHaulerBrokerEmail] = useState('');

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
    } catch (error) {
      console.error('Error submitting to waitlist:', error);
      toast.error('Failed to join waitlist. Please try again.');
    }
  };

  const handleHaulerBrokerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!haulerBrokerType) {
      toast.error('Please select Hauler or Broker');
      return;
    }
    
    if (!haulerBrokerEmail) {
      toast.error('Please enter your email');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(haulerBrokerEmail)) {
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
        body: JSON.stringify({ email: haulerBrokerEmail, userType: haulerBrokerType }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Waitlist signup error:', data);
        toast.error(data.error || 'Failed to join waitlist');
        return;
      }

      toast.success(`Thanks for joining the waitlist! We'll contact you at ${haulerBrokerEmail}`);
      
      setHaulerBrokerEmail('');
      setHaulerBrokerType('');
    } catch (error) {
      console.error('Error submitting to waitlist:', error);
      toast.error('Failed to join waitlist. Please try again.');
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-9 pt-10 pb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="flex flex-col gap-6">
              <h1 className="font-['Inter:Regular',_sans-serif] text-[#101828] text-[48px] lg:text-[54px] leading-[54px] tracking-[0.3164px] lg:text-left text-center ml-[15%]">
                Coming Soon
              </h1>
              
              <div className="flex justify-center lg:justify-start">
                <img 
                  src={imgImageWasteGeek} 
                  alt="Waste Geek" 
                  className="h-[72px] object-contain" 
                />
              </div>
              
              <p className="font-['Inter:Regular',_sans-serif] text-[#4a5565] text-[20px] lg:text-[22.5px] leading-[31.5px] tracking-[-0.1813px] lg:text-left text-center max-w-[520px] bg-white">
                Waste Geek is modernizing the commercial waste industry by removing the friction between commercial waste customers, haulers, and brokers.
              </p>
              
              {/* Waitlist Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2 max-w-[520px] scale-[0.88] origin-top translate-y-[10%]">
                <div>
                  <label className="block font-['Georgia',_serif] text-[rgb(13,13,13)] text-[30.6px] mb-3 text-center font-bold font-[Microsoft_Sans_Serif]">
                    Commercial Waste Customers! Don't get left on the curb with the trash, join the Waste Geek waitlist today!
                  </label>
                </div>
                
                <div>
                  <input
                    type="email"
                    id="email"
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
              
              {/* Hauler/Broker Waitlist Form */}
              <form onSubmit={handleHaulerBrokerSubmit} className="flex flex-col gap-4 max-w-[520px] w-full mt-8 scale-[0.9] origin-top">
                <div>
                  <label className="block font-['Georgia',_serif] text-[rgb(13,13,13)] text-[30.6px] mb-3 text-center font-bold font-[Microsoft_Sans_Serif]">
                    Are you a Waste Hauler or Broker?
                  </label>
                </div>
                
                <div>
                  <Select value={haulerBrokerType} onValueChange={(value: 'hauler' | 'broker') => setHaulerBrokerType(value)}>
                    <SelectTrigger className="w-full px-4 py-3 rounded-[9.25px] border-2 border-[#d1d5dc] focus:border-[#155dfc] font-['Inter:Regular',_sans-serif] text-[16px] text-[#101828]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hauler">Hauler</SelectItem>
                      <SelectItem value="broker">Broker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <input
                    type="email"
                    value={haulerBrokerEmail}
                    onChange={(e) => setHaulerBrokerEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-[9.25px] border-2 border-[#d1d5dc] focus:border-[#155dfc] focus:outline-none font-['Inter:Regular',_sans-serif] text-[16px] text-[#101828] placeholder:text-[#9ca3af]"
                  />
                </div>
                
                <button
                  type="submit"
                  className="bg-[#155dfc] text-white px-[27px] py-3.5 rounded-[9.25px] font-['Inter:Medium',_sans-serif] text-[20.25px] tracking-[-0.4276px] hover:bg-[#1248c9] transition-colors text-center w-[60%] mx-auto"
                >
                  Become a Partner
                </button>
              </form>
            </div>
            
            {/* Right Column - Illustration */}
            <div className="flex flex-col gap-6 justify-center lg:justify-end items-center">
              <div className="flex flex-col gap-2.5 justify-center items-center">
                <span className="font-['Inter:Bold',_sans-serif] text-[#101828] text-[36px] font-[Miltonian_Tattoo] font-bold">Front-Load Waste</span>
                <span className="font-['Inter:Bold',_sans-serif] text-[#101828] text-[36px] font-[ADLaM_Display]">Open-Top Roll Offs</span>
              </div>
              
              <img 
                src={imgImageProfessionalWasteManagementIllustration} 
                alt="Professional waste management" 
                className="w-full max-w-[432px] h-auto object-contain" 
              />
              
              <div className="flex flex-col gap-2.5 justify-center items-center -translate-y-[35%]">
                <span className="font-['Inter:Bold',_sans-serif] text-[#101828] text-[36px] font-[Miltonian_Tattoo] font-bold">Recycling</span>
                <span className="font-['Inter:Bold',_sans-serif] text-[#101828] text-[36px] font-[ADLaM_Display]">Junk Removal</span>
                <span className="font-['Inter:Bold',_sans-serif] text-[#101828] text-[36px] font-[Suez_One] font-bold">Valet Waste</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <div className="bg-gradient-to-b from-[#eff6ff] to-[#ffffff] py-20">
        <div className="max-w-7xl mx-auto px-9">
          <div className="text-center mb-16">
            <h2 className="font-['Inter:Regular',_sans-serif] text-[#101828] text-[33.75px] tracking-[0.3924px] mb-4">
              What is Waste Geek?
            </h2>
            <p className="font-['Inter:Regular',_sans-serif] text-[#4a5565] text-[20.25px] tracking-[-0.4276px] max-w-[839px] mx-auto">
              Waste Geek connects commercial waste customers to commercial waste solutions. Find quality haulers while removing all of the guess work, in a fraction of the time!
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-9">
            {/* Card 1 - Local Haulers */}
            <div className="bg-white rounded-[15.25px] border border-gray-200 p-6 flex flex-col items-center text-center">
              <div className="bg-blue-100 rounded-[11.25px] w-[54px] h-[54px] flex items-center justify-center mb-6">
                <svg className="w-[27px] h-[27px]" fill="none" viewBox="0 0 27 27">
                  <path d={svgPaths.p2d901780} stroke="#155DFC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" />
                </svg>
              </div>
              <h3 className="font-['Inter:Regular',_sans-serif] text-[#101828] text-[20.25px] tracking-[-0.4276px] mb-3">
                Local Haulers
              </h3>
              <p className="font-['Inter:Regular',_sans-serif] text-[#4a5565] text-[18px] tracking-[-0.4395px]">
                Connect with local haulers that are committed to taking care of your waste needs
              </p>
            </div>
            
            {/* Card 2 - Competitive Pricing */}
            <div className="bg-white rounded-[15.25px] border border-gray-200 p-6 flex flex-col items-center text-center">
              <div className="bg-green-100 rounded-[11.25px] w-[54px] h-[54px] flex items-center justify-center mb-6">
                <svg className="w-[27px] h-[27px]" fill="none" viewBox="0 0 27 27">
                  <path d={svgPaths.p2a814480} stroke="#00A63E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" />
                </svg>
              </div>
              <h3 className="font-['Inter:Regular',_sans-serif] text-[#101828] text-[20.25px] tracking-[-0.4276px] mb-3">
                Competitive Pricing
              </h3>
              <p className="font-['Inter:Regular',_sans-serif] text-[#4a5565] text-[18px] tracking-[-0.4395px]">
                Quickly choose service or get quotes from multiple haulers to ensure you're getting the best value.
              </p>
            </div>
            
            {/* Card 3 - Easy Management */}
            <div className="bg-white rounded-[15.25px] border border-gray-200 p-6 flex flex-col items-center text-center">
              <div className="bg-purple-100 rounded-[11.25px] w-[54px] h-[54px] flex items-center justify-center mb-6">
                <svg className="w-[27px] h-[27px]" fill="none" viewBox="0 0 27 27">
                  <path d={svgPaths.p945d000} stroke="#9810FA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" />
                </svg>
              </div>
              <h3 className="font-['Inter:Regular',_sans-serif] text-[#101828] text-[20.25px] tracking-[-0.4276px] mb-3">
                Easy Management
              </h3>
              <p className="font-['Inter:Regular',_sans-serif] text-[#4a5565] text-[18px] tracking-[-0.4395px]">
                Manage all your waste services, contracts, and invoices in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}