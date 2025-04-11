
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BADGES, BadgeType } from '@/components/UserStreak';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarCheck, Calendar, Trophy, User } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from '@/lib/toast';
import { Redirect } from '@/components/Redirect';

interface StreakData {
  streak_days: number;
  longest_streak: number;
  last_active_date: string;
  badges: string[];
}

const Profile = () => {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreakData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_streaks')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching streak data:', error);
          toast.error('Could not load streak data');
          setLoading(false);
          return;
        }

        setStreakData(data as StreakData);
      } catch (error) {
        console.error('Error in streak data fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreakData();
  }, [user]);

  if (!user) {
    return <Redirect to="/auth" />;
  }

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  // Format a date string to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-6 mt-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8 text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || 'User profile'} />
              <AvatarFallback className="text-3xl">{getInitials()}</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold">{user.email}</h1>
            <p className="text-muted-foreground">Member since {formatDate(user.created_at || new Date().toISOString())}</p>
          </div>

          {loading ? (
            <div className="space-y-4">
              <div className="h-52 bg-card animate-pulse rounded-lg" />
              <div className="h-64 bg-card animate-pulse rounded-lg" />
            </div>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarCheck className="h-5 w-5 text-primary" />
                    Your Progress
                  </CardTitle>
                  <CardDescription>Track your daily usage and streak progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                      <CalendarCheck className="h-8 w-8 text-primary mb-2" />
                      <p className="text-2xl font-bold">{streakData?.streak_days || 0}</p>
                      <p className="text-sm text-muted-foreground">Current Streak</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                      <Trophy className="h-8 w-8 text-amber-500 mb-2" />
                      <p className="text-2xl font-bold">{streakData?.longest_streak || 0}</p>
                      <p className="text-sm text-muted-foreground">Longest Streak</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                      <Calendar className="h-8 w-8 text-blue-500 mb-2" />
                      <p className="text-2xl font-bold">{streakData?.last_active_date ? formatDate(streakData.last_active_date) : 'Today'}</p>
                      <p className="text-sm text-muted-foreground">Last Active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Badges & Achievements
                  </CardTitle>
                  <CardDescription>Badges earned through consistent usage</CardDescription>
                </CardHeader>
                <CardContent>
                  {(!streakData?.badges || streakData.badges.length === 0) ? (
                    <div className="text-center py-8">
                      <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Continue your streak to earn badges!</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Your first badge awaits after 7 days of continuous usage.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {streakData.badges.map((badgeName) => {
                        const badge = BADGES.find(b => b.name === badgeName) as BadgeType;
                        return (
                          <div key={badgeName} className="flex items-center gap-3 p-3 border rounded-lg">
                            <Badge className={`${badge.color} h-8 w-8 flex items-center justify-center rounded-full p-1.5`}>
                              {badge.icon}
                            </Badge>
                            <div>
                              <h3 className="font-medium">{badge.name}</h3>
                              <p className="text-sm text-muted-foreground">{badge.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">Available Badges</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {BADGES.map((badge) => {
                        const isEarned = streakData?.badges?.includes(badge.name);
                        return (
                          <div 
                            key={badge.name} 
                            className={`flex items-center gap-3 p-3 border rounded-lg ${
                              isEarned ? 'border-primary/30 bg-primary/5' : 'opacity-50'
                            }`}
                          >
                            <Badge className={`${badge.color} h-8 w-8 flex items-center justify-center rounded-full p-1.5 ${
                              !isEarned && 'opacity-50' 
                            }`}>
                              {badge.icon}
                            </Badge>
                            <div>
                              <h3 className="font-medium">{badge.name}</h3>
                              <p className="text-sm text-muted-foreground">{badge.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
