import React from 'react';
import {
  Wifi,
  Waves,
  Sparkles,
  Utensils,
  Car,
  Plane,
  Wine,
  Bell,
  Tv,
  Wind,
  Coffee,
  CheckCircle,
  Eye,
  Flame,
  ShieldCheck,
} from 'lucide-react';

export const AmenityIcon = ({ name = '', className = 'w-4 h-4' }) => {
  const lower = name.toLowerCase();

  if (lower.includes('wi-fi') || lower.includes('wifi') || lower.includes('internet')) {
    return <Wifi className={className} />;
  }
  if (lower.includes('pool') || lower.includes('swim') || lower.includes('beach')) {
    return <Waves className={className} />;
  }
  if (lower.includes('spa') || lower.includes('wellness') || lower.includes('massage')) {
    return <Sparkles className={className} />;
  }
  if (lower.includes('dining') || lower.includes('restaurant') || lower.includes('breakfast') || lower.includes('food')) {
    return <Utensils className={className} />;
  }
  if (lower.includes('parking')) {
    return <Car className={className} />;
  }
  if (lower.includes('shuttle') || lower.includes('airport') || lower.includes('transfer')) {
    return <Plane className={className} />;
  }
  if (lower.includes('bar') || lower.includes('lounge') || lower.includes('drinks')) {
    return <Wine className={className} />;
  }
  if (lower.includes('room service') || lower.includes('butler') || lower.includes('service')) {
    return <Bell className={className} />;
  }
  if (lower.includes('tv')) {
    return <Tv className={className} />;
  }
  if (lower.includes('air conditioning') || lower.includes('ac')) {
    return <Wind className={className} />;
  }
  if (lower.includes('coffee') || lower.includes('espresso') || lower.includes('tea')) {
    return <Coffee className={className} />;
  }
  if (lower.includes('view')) {
    return <Eye className={className} />;
  }
  if (lower.includes('fire') || lower.includes('fireplace')) {
    return <Flame className={className} />;
  }

  return <CheckCircle className={className} />;
};

export default AmenityIcon;
