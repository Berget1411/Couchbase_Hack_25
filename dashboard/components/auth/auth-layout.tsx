import { Target } from "lucide-react";
import { HeroBackground } from "../ui/hero-background";
import { MatrixAsciiArt } from "../ui/matrix-ascii-art";
import Link from "next/link";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeroBackground />
      <div className='grid min-h-svh md:grid-cols-5 lg:grid-cols-2 relative z-20'>
        <div className='flex flex-col gap-4 p-6 md:p-8 lg:p-10 md:col-span-2 lg:col-span-1'>
          <div className='flex justify-center gap-2 md:justify-start'>
            <Link
              href='/'
              className='flex items-center gap-2 font-medium text-lg'
            >
              <Target className='h-6 w-6 text-primary' />
              SmartPyLogger
            </Link>
          </div>
          <div className='flex flex-1 items-center justify-center'>
            <div className='w-full max-w-sm md:max-w-md lg:max-w-xs'>
              {children}
            </div>
          </div>
        </div>
        <div className='bg-background relative hidden md:flex md:col-span-3 lg:col-span-1 items-center justify-center p-4 lg:p-2 border-l border-border overflow-hidden'>
          <MatrixAsciiArt />
        </div>
      </div>
    </>
  );
}
