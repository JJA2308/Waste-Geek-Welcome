import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Users, Truck, Briefcase, Mail, Calendar } from 'lucide-react';

interface WaitlistEntry {
  email: string;
  userType: 'customer' | 'hauler' | 'broker';
  timestamp: string;
}

interface WaitlistData {
  all: WaitlistEntry[];
  customers: WaitlistEntry[];
  haulers: WaitlistEntry[];
  brokers: WaitlistEntry[];
  total: number;
}

export function AdminDashboard() {
  const [data, setData] = useState<WaitlistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWaitlistData();
  }, []);

  const fetchWaitlistData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b97cbce7/waitlist`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch waitlist data');
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      console.error('Error fetching waitlist data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const EntryList = ({ entries, emptyMessage }: { entries: WaitlistEntry[], emptyMessage: string }) => (
    <div className="space-y-3">
      {entries.length === 0 ? (
        <p className="text-center text-gray-500 py-8">{emptyMessage}</p>
      ) : (
        entries
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-[#155dfc]" />
                <div>
                  <p className="font-['Inter:Medium',_sans-serif] text-[#101828]">
                    {entry.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="size-3 text-gray-400" />
                    <p className="text-sm text-gray-500">{formatDate(entry.timestamp)}</p>
                  </div>
                </div>
              </div>
              <Badge 
                variant="secondary" 
                className="capitalize"
              >
                {entry.userType}
              </Badge>
            </div>
          ))
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#dbeafe] to-[#f8fafc] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#155dfc]"></div>
            <p className="mt-4 text-gray-600">Loading waitlist data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#dbeafe] to-[#f8fafc] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700">Error Loading Data</CardTitle>
              <CardDescription className="text-red-600">{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <button
                onClick={fetchWaitlistData}
                className="bg-[#155dfc] text-white px-6 py-2 rounded-lg hover:bg-[#1248c9] transition-colors"
              >
                Retry
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#dbeafe] to-[#f8fafc] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-['Georgia',_serif] text-[40px] text-[#101828] mb-2">
            Admin Dashboard
          </h1>
          <p className="text-[#4a5565] text-lg">
            View and manage waitlist signups
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Signups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Mail className="size-8 text-[#155dfc]" />
                <p className="text-3xl font-bold text-[#101828]">{data?.total || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Users className="size-8 text-green-600" />
                <p className="text-3xl font-bold text-[#101828]">{data?.customers.length || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Haulers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Truck className="size-8 text-blue-600" />
                <p className="text-3xl font-bold text-[#101828]">{data?.haulers.length || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Brokers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Briefcase className="size-8 text-purple-600" />
                <p className="text-3xl font-bold text-[#101828]">{data?.brokers.length || 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different user types */}
        <Card>
          <CardHeader>
            <CardTitle>Waitlist Entries</CardTitle>
            <CardDescription>Browse all collected email addresses by user type</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({data?.total || 0})</TabsTrigger>
                <TabsTrigger value="customers">Customers ({data?.customers.length || 0})</TabsTrigger>
                <TabsTrigger value="haulers">Haulers ({data?.haulers.length || 0})</TabsTrigger>
                <TabsTrigger value="brokers">Brokers ({data?.brokers.length || 0})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <EntryList 
                  entries={data?.all || []} 
                  emptyMessage="No waitlist entries yet"
                />
              </TabsContent>

              <TabsContent value="customers" className="mt-6">
                <EntryList 
                  entries={data?.customers || []} 
                  emptyMessage="No customer signups yet"
                />
              </TabsContent>

              <TabsContent value="haulers" className="mt-6">
                <EntryList 
                  entries={data?.haulers || []} 
                  emptyMessage="No hauler signups yet"
                />
              </TabsContent>

              <TabsContent value="brokers" className="mt-6">
                <EntryList 
                  entries={data?.brokers || []} 
                  emptyMessage="No broker signups yet"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Refresh Button */}
        <div className="mt-6 text-center">
          <button
            onClick={fetchWaitlistData}
            className="bg-[#155dfc] text-white px-6 py-3 rounded-lg hover:bg-[#1248c9] transition-colors font-['Inter:Medium',_sans-serif]"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
}
