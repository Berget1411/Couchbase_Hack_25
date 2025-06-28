"use client";

import { ReactNode } from "react";

interface StorySectionProps {
  title: string;
  children: ReactNode;
}

export function StorySection({ title, children }: StorySectionProps) {
  return (
    <div>
      <h3 className='text-lg font-semibold mb-3 text-gray-200'>{title}</h3>
      {children}
    </div>
  );
}
