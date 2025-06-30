import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { Target } from "lucide-react";
export function Footer() {
  return (
    <footer className='relative z-10 w-full border-t border-neutral-200 py-12 dark:border-white/[0.1] sm:py-16 lg:py-24'>
      <div className='relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col items-center justify-center space-y-4'>
          <div className='flex items-center space-x-2'>
            <Target className='h-4 w-4  text-primary' />
            <span className='text-muted-foreground'>Own your logs</span>
          </div>
          <h2 className='text-3xl font-bold text-center max-w-lg mb-6'>
            Roll your own logging with confidence in minutes!
          </h2>
          <HoverBorderGradient className='cursor-pointer'>
            <div className='flex items-center space-x-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='h-4 w-4'
              >
                <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387 0.599 0.111 0.793-0.261 0.793-0.577v-2.234c-3.338 0.726-4.033-1.416-4.033-1.416-0.546-1.387-1.333-1.756-1.333-1.756-1.082-0.742 0.082-0.726 0.082-0.726 1.199 0.086 1.839 1.238 1.839 1.238 1.063 1.831 2.792 1.305 3.493 0.998 0.108-0.776 0.418-1.305 0.762-1.604-2.665-0.305-5.467-1.334-5.467-5.931 0-1.311 0.469-2.381 1.236-3.221-0.124-0.303-0.535-1.524 0.118-3.176 0 0 1.008-0.322 3.301 1.23 0.957-0.266 1.984-0.399 3.006-0.399 1.023 0 2.049 0.133 3.006 0.399 2.293-1.552 3.301-1.23 3.301-1.23 0.653 1.653 0.242 2.874 0.118 3.176 0.769 0.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921 0.43 0.372 0.823 1.102 0.823 2.222v3.293c0 0.319 0.192 0.694 0.801 0.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'></path>
              </svg>
              <span>Star on GitHub</span>
              <span className='rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'>
                15.6K+
              </span>
            </div>
          </HoverBorderGradient>
        </div>
      </div>
      <div className='absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-[0.02]'>
        <Target className='h-96 w-96 text-neutral-950 dark:text-white  ' />
      </div>
    </footer>
  );
}
