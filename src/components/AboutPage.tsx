import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Users, TrendingUp, Shield } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import svgPaths from "../imports/svg-cp7lk6nsuy";
import imgCustomerTypes from "figma:asset/customer-types-image.png";
import imgPeopleGrid from "figma:asset/6faa60145f848296bd5fce8ca7c95bed5a01f983.png";

export function AboutPage() {
  const [haulerBrokerType, setHaulerBrokerType] = useState<'hauler' | 'broker' | ''>('');;
  const [haulerBrokerEmail, setHaulerBrokerEmail] = useState('');
  const [email, setEmail] = useState('');

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

  return (
    <>
      {/* Hero Section */}
      <div className="bg-white py-[39px]">
        <div className="max-w-7xl mx-auto px-[17px]">
          <div className="text-center mt-[7.5px]">
            <h2 className="font-['Inter:Regular',_sans-serif] text-[#101828] text-[33.75px] tracking-[0.3924px] mb-[8px]">
              Commercial Waste Customers
            </h2>
            <p className="font-['Inter:Regular',_sans-serif] text-[#4a5565] text-[20.25px] tracking-[-0.4276px] max-w-[839px] mx-auto">
              Stop wasting time calling around for quotes, worrying about getting overcharged, or dealing with hidden charges. Waste Geek makes finding and managing waste services simple.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-gradient-to-b from-[#eff6ff] to-[#ffffff] py-10">
        <div className="max-w-7xl mx-auto px-9">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-2">
            <div>
              <h2 className="font-['Inter:Regular',_sans-serif] text-[#101828] text-[33.75px] tracking-[0.3924px] mb-6 text-center">
                Our Mission
              </h2>
              <p className="font-['Inter:Regular',_sans-serif] text-[#4a5565] text-[20.25px] tracking-[-0.4276px] mb-6">
                Commercial waste management is often confusing, opaque, and frustrating for businesses. Finding the right hauler, negotiating fair pricing, and managing contracts can feel like navigating a maze.
              </p>
              <p className="font-['Inter:Regular',_sans-serif] text-[#4a5565] text-[20.25px] tracking-[-0.4276px]">
                Waste Geek cuts through the friction. We connect commercial waste customers with quality waste solutions, while providing clarity and ease to all parties involved. Waste Geek is positioned to become the central hub for the entire commercial waste industry!
              </p>
            </div>
            <div className="flex justify-center">
              <img 
                src={imgPeopleGrid} 
                alt="Waste Geek customers, haulers, and brokers" 
                className="w-full max-w-[600px] h-auto object-contain rounded-lg" 
              />
            </div>
          </div>
          
          <div className="mt-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-[520px] scale-[0.88] origin-top translate-y-[10%] mx-auto">
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
          </div>
        </div>
      </div>

      {/* For Customers Section */}
      <div className="bg-white pt-6 pb-12">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-gradient-to-b from-[#eff6ff] to-[#ffffff] rounded-[15.25px] border border-gray-200 p-5 flex flex-col items-center text-center">
              <div className="bg-blue-100 rounded-[11.25px] w-[54px] h-[54px] flex items-center justify-center mb-4">
                <svg className="w-[27px] h-[27px]" fill="none" viewBox="0 0 27 27">
                  <path d={svgPaths.p2d901780} stroke="#155DFC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" />
                </svg>
              </div>
              <h3 className="font-['Inter:Regular',_sans-serif] text-[#101828] text-[20.25px] tracking-[-0.4276px] mb-2">
                Find Quality Haulers Fast
              </h3>
              <p className="font-['Inter:Regular',_sans-serif] text-[#4a5565] text-[18px] tracking-[-0.4395px]">
                No more endless phone calls. Connect with vetted local haulers in minutes, not days.
              </p>
            </div>

            <div className="bg-gradient-to-b from-[#eff6ff] to-[#ffffff] rounded-[15.25px] border border-gray-200 p-5 flex flex-col items-center text-center">
              <div className="bg-green-100 rounded-[11.25px] w-[54px] h-[54px] flex items-center justify-center mb-4">
                <svg className="w-[27px] h-[27px]" fill="none" viewBox="0 0 27 27">
                  <path d={svgPaths.p2a814480} stroke="#00A63E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" />
                </svg>
              </div>
              <h3 className="font-['Inter:Regular',_sans-serif] text-[#101828] text-[20.25px] tracking-[-0.4276px] mb-2">
                Transparent Pricing
              </h3>
              <p className="font-['Inter:Regular',_sans-serif] text-[#4a5565] text-[18px] tracking-[-0.4395px]">
                Get competitive quotes from multiple haulers and make informed decisions with complete price transparency.
              </p>
            </div>

            <div className="bg-gradient-to-b from-[#eff6ff] to-[#ffffff] rounded-[15.25px] border border-gray-200 p-5 flex flex-col items-center text-center">
              <div className="bg-purple-100 rounded-[11.25px] w-[54px] h-[54px] flex items-center justify-center mb-4">
                <svg className="w-[27px] h-[27px]" fill="none" viewBox="0 0 27 27">
                  <path d={svgPaths.p945d000} stroke="#9810FA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" />
                </svg>
              </div>
              <h3 className="font-['Inter:Regular',_sans-serif] text-[#101828] text-[20.25px] tracking-[-0.4276px] mb-2">
                Centralized Management
              </h3>
              <p className="font-['Inter:Regular',_sans-serif] text-[#4a5565] text-[18px] tracking-[-0.4395px]">
                Manage contracts, invoices, and service schedules all in one easy-to-use platform.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* For Haulers & Brokers Section */}
      <div className="bg-gradient-to-b from-[#eff6ff] to-[#ffffff] py-5 px-2">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <p className="font-['Inter:Regular',_sans-serif] text-[#4a5565] text-[20.25px] tracking-[-0.4276px] max-w-[839px] mx-auto">
              Waste Geek has great benefits for both Commercial Waste Haulers and Brokers alike.
            </p>
          </div>

          <form onSubmit={handleHaulerBrokerSubmit} className="flex flex-col gap-4 max-w-[520px] w-full mx-auto scale-[0.9] origin-top">
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
      </div>
    </>
  );
}