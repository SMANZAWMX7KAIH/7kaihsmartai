import React from 'react';
import { 
  Sunrise, 
  HeartHandshake, 
  Activity, 
  Apple, 
  GraduationCap, 
  Users, 
  Moon, 
  Sparkles,
  Award,
  Crown,
  HelpCircle
} from 'lucide-react';

interface HabitIconProps {
  name: string;
  className?: string;
}

export const HabitIcon: React.FC<HabitIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'Sunrise':
      return <Sunrise className={className} />;
    case 'HeartHandshake':
      return <HeartHandshake className={className} />;
    case 'Activity':
      return <Activity className={className} />;
    case 'Apple':
      return <Apple className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'Moon':
      return <Moon className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Award':
      return <Award className={className} />;
    case 'Crown':
      return <Crown className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};
