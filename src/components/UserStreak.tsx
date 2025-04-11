
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Flame } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/lib/toast';

export type BadgeType = {
  name: 'Focus Flame' | 'Visionary Ember' | 'Discipline Dynamo' | 'Lex Legend';
  description: string;
  threshold: number; // days
  color: string;
  icon: JSX.Element;
};

export const BADGES: BadgeType[] = [
  {
    name: 'Focus Flame',
    description: 'Maintained a streak for 1 week',
    threshold: 7,
    color: 'bg-amber-500',
    icon: <Flame className="h-4 w-4" />
  },
  {
    name: 'Visionary Ember',
    description: 'Maintained a streak for 1 month',
    threshold: 30,
    color: 'bg-emerald-500',
    icon: <Flame className="h-4 w-4" />
  },
  {
    name: 'Discipline Dynamo',
    description: 'Maintained a streak for 3 months',
    threshold: 90,
    color: 'bg-blue-500',
    icon: <Flame className="h-4 w-4" />
  },
  {
    name: 'Lex Legend',
    description: 'Maintained a streak for 6 months',
    threshold: 180,
    color: 'bg-purple-500',
    icon: <Flame className="h-4 w-4" />
  }
];

export const getBadgeByName = (name: string): BadgeType | undefined => {
  return BADGES.find(badge => badge.name === name);
};

export const UserStreak = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

  useEffect(() => {
    const fetchStreak = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_streaks')
          .select('streak_days, last_active_date, badges')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching streak:', error);
          setLoading(false);
          return;
        }

        if (data) {
          // Check if the user was active yesterday or today to maintain streak
          const lastActive = new Date(data.last_active_date);
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          
          // Reset date times to midnight for comparison
          lastActive.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);
          yesterday.setHours(0, 0, 0, 0);
          
          const isActiveToday = lastActive.getTime() === today.getTime();
          const wasActiveYesterday = lastActive.getTime() === yesterday.getTime();
          
          let currentStreak = data.streak_days;
          
          // If they haven't been active today or yesterday, reset streak
          if (!isActiveToday && !wasActiveYesterday) {
            currentStreak = 1; // Reset to 1 for today
            
            // Update the streak in the database
            await supabase
              .from('user_streaks')
              .update({ 
                streak_days: currentStreak,
                last_active_date: new Date().toISOString().split('T')[0]
              })
              .eq('user_id', user.id);
          } 
          // If they haven't been active today but were yesterday, increment streak
          else if (!isActiveToday && wasActiveYesterday) {
            currentStreak += 1;
            
            // Update the streak in the database
            await supabase
              .from('user_streaks')
              .update({ 
                streak_days: currentStreak,
                last_active_date: new Date().toISOString().split('T')[0]
              })
              .eq('user_id', user.id);
            
            // Check if the user has earned any new badges
            const newBadges = checkForNewBadges(currentStreak, data.badges || []);
            if (newBadges.length > 0) {
              // Update badges in database
              await supabase
                .from('user_streaks')
                .update({ 
                  badges: [...(data.badges || []), ...newBadges]
                })
                .eq('user_id', user.id);
                
              // Show toast for each new badge
              newBadges.forEach(badge => {
                toast.success(`🎉 New Badge Earned: ${badge}!`);
              });
            }
          }
          
          setStreak(currentStreak);
          setEarnedBadges(data.badges || []);
        } else {
          // Create a new streak record if none exists
          const { error: insertError } = await supabase
            .from('user_streaks')
            .insert({
              user_id: user.id,
              streak_days: 1,
              last_active_date: new Date().toISOString().split('T')[0],
              badges: []
            });
            
          if (insertError) {
            console.error('Error creating streak record:', insertError);
          } else {
            setStreak(1);
          }
        }
      } catch (error) {
        console.error('Error managing streak:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreak();
  }, [user]);

  const checkForNewBadges = (currentStreak: number, currentBadges: string[]): string[] => {
    const newBadges: string[] = [];
    
    BADGES.forEach(badge => {
      if (currentStreak >= badge.threshold && !currentBadges.includes(badge.name)) {
        newBadges.push(badge.name);
      }
    });
    
    return newBadges;
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 rounded-full h-6 w-20"></div>;
  }

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <>
          <div className="flex items-center gap-1 text-sm font-medium">
            <Flame className="h-4 w-4 text-amber-500" />
            <span>{streak} day{streak !== 1 ? 's' : ''}</span>
          </div>
          {earnedBadges.length > 0 && (
            <div className="flex -space-x-1">
              {earnedBadges.slice(0, 2).map((badgeName) => {
                const badge = getBadgeByName(badgeName);
                return badge ? (
                  <Badge 
                    key={badgeName} 
                    className={`${badge.color} text-white`}
                    variant="secondary"
                  >
                    {badge.icon}
                  </Badge>
                ) : null;
              })}
              {earnedBadges.length > 2 && (
                <Badge variant="outline" className="bg-background">
                  +{earnedBadges.length - 2}
                </Badge>
              )}
            </div>
          )}
        </>
      ) : (
        <span className="text-sm text-muted-foreground">
          Sign in to track streaks
        </span>
      )}
    </div>
  );
};

export default UserStreak;
