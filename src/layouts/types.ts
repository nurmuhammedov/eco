import React from 'react';

export type NavigationItem = {
  url: string;
  title: string;
  icon: React.ElementType;
};

export type Navigation = NavigationItem[];
