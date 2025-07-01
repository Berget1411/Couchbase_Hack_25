"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Docs() {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/docs");
        if (!response.ok) {
          throw new Error("Failed to fetch documentation content");
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
      key='docs'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className='h-full overflow-y-auto'
    >
      <div className='max-w-4xl mx-auto px-6 py-8'>
        {loading && (
          <div className='text-center py-8'>
            <div className='text-muted-foreground'>
              Loading documentation...
            </div>
          </div>
        )}

        {error && (
          <div className='text-center py-8'>
            <div className='text-destructive'>Error: {error}</div>
          </div>
        )}

        {!loading && !error && (
          <div className='prose prose-neutral dark:prose-invert prose-lg max-w-none'>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className='text-4xl font-bold mb-8 text-foreground border-b border-border pb-4'>
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className='text-2xl font-semibold mb-6 mt-10 text-foreground/90 border-b border-border/50 pb-2'>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className='text-xl font-semibold mb-4 mt-8 text-foreground/80'>
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className='text-lg font-semibold mb-3 mt-6 text-muted-foreground'>
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p className='text-muted-foreground leading-relaxed mb-6'>
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className='text-muted-foreground space-y-2 ml-6 mb-6 leading-relaxed list-disc'>
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className='text-muted-foreground space-y-2 ml-6 mb-6 leading-relaxed list-decimal'>
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className='text-muted-foreground'>{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className='border-l-4 border-primary pl-4 italic text-foreground/80 my-6'>
                    {children}
                  </blockquote>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className='bg-muted text-foreground px-1.5 py-0.5 rounded text-sm'>
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className='block bg-muted/50 text-foreground p-4 rounded-lg overflow-x-auto text-sm leading-relaxed'>
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className='bg-muted/50 text-foreground p-4 rounded-lg overflow-x-auto mb-6 border border-border'>
                    {children}
                  </pre>
                ),
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className='text-primary hover:text-primary/80 underline'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {children}
                  </a>
                ),
                hr: () => <hr className='border-border my-8' />,
                strong: ({ children }) => (
                  <strong className='text-foreground font-semibold'>
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className='text-foreground/80 italic'>{children}</em>
                ),
                table: ({ children }) => (
                  <div className='overflow-x-auto my-6'>
                    <table className='min-w-full border border-border rounded-lg'>
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className='bg-muted'>{children}</thead>
                ),
                tbody: ({ children }) => (
                  <tbody className='bg-card'>{children}</tbody>
                ),
                tr: ({ children }) => (
                  <tr className='border-b border-border'>{children}</tr>
                ),
                th: ({ children }) => (
                  <th className='px-4 py-2 text-left text-foreground font-semibold'>
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className='px-4 py-2 text-muted-foreground'>
                    {children}
                  </td>
                ),
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
