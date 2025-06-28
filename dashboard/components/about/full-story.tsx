"use client";

import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface FullStoryProps {
  onBack: () => void;
}

export function FullStory({ onBack }: FullStoryProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/story");
        if (!response.ok) {
          throw new Error("Failed to fetch story content");
        }
        const data = await response.json();
        setContent(data.content);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <motion.div
      key='fullstory'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className='h-full overflow-y-auto'
    >
      <div className='max-w-4xl mx-auto'>
        <div className='text-sm text-gray-400 mb-4 flex items-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={onBack}
            className='p-1 h-auto text-gray-400 hover:text-white'
          >
            <ArrowLeft className='w-4 h-4' />
          </Button>
          Stockholm Hackathon // July 1st, 2025
        </div>

        {loading && (
          <div className='text-center py-8'>
            <div className='text-gray-400'>Loading story...</div>
          </div>
        )}

        {error && (
          <div className='text-center py-8'>
            <div className='text-red-400'>Error: {error}</div>
          </div>
        )}

        {!loading && !error && (
          <div className='prose prose-invert prose-lg max-w-none'>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className='text-3xl font-bold mb-8 text-white'>
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className='text-xl font-semibold mb-6 mt-8 text-gray-200'>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className='text-lg font-semibold mb-3 text-gray-300'>
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className='text-gray-400 leading-relaxed mb-6'>
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className='text-gray-400 space-y-2 ml-6 mb-6 leading-relaxed list-disc'>
                    {children}
                  </ul>
                ),
                li: ({ children }) => (
                  <li className='text-gray-400'>{children}</li>
                ),
                hr: () => <hr className='border-gray-700 my-8' />,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}
