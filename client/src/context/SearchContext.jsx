import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
  const [searchParams] = useSearchParams();

  // Helper date formatters
  const getDefaultDates = () => {
    const today = new Date();
    const inDate = new Date(today);
    inDate.setDate(today.getDate() + 3);

    const outDate = new Date(today);
    outDate.setDate(today.getDate() + 5);

    const format = (d) => d.toISOString().split('T')[0];
    return {
      checkIn: format(inDate),
      checkOut: format(outDate),
    };
  };

  const defaults = getDefaultDates();

  const [destination, setDestination] = useState(searchParams.get('city') || '');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || defaults.checkIn);
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || defaults.checkOut);
  const [adults, setAdults] = useState(Number(searchParams.get('adults')) || 2);
  const [childrenCount, setChildrenCount] = useState(Number(searchParams.get('children')) || 0);
  const [roomsCount, setRoomsCount] = useState(Number(searchParams.get('rooms')) || 1);

  // Calculate nights
  const calculateNights = (inDateStr, outDateStr) => {
    const start = new Date(inDateStr);
    const end = new Date(outDateStr);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return isNaN(diffDays) || diffDays < 1 ? 1 : diffDays;
  };

  const nights = calculateNights(checkIn, checkOut);

  const value = {
    destination,
    setDestination,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    adults,
    setAdults,
    childrenCount,
    setChildrenCount,
    roomsCount,
    setRoomsCount,
    nights,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export default SearchContext;
