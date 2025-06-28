"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./button";
import { Target, Github, Sun, Menu, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "./drawer";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const { data: session, isPending } = authClient.useSession();

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='w-full flex h-14 items-center px-4'>
        {/* Logo */}
        <Link className='flex items-center space-x-2 mr-8' href='/'>
          <Target className='h-5 w-5 text-primary' />
          <span className='font-bold text-lg'>SmartPyLogger</span>
        </Link>

        {/* Separator */}
        <div className='hidden md:block h-6 w-px bg-border mr-6' />

        {/* Desktop Navigation Links */}
        <nav className='hidden md:flex items-center space-x-6 text-sm font-medium'>
          <Link
            className='transition-colors hover:text-foreground/80 text-foreground/60'
            href='/docs'
          >
            docs
          </Link>
          <Link
            className='transition-colors hover:text-foreground/80 text-foreground/60'
            href='/changelogs'
          >
            changelogs
          </Link>
          <Link
            className='transition-colors hover:text-foreground/80 text-foreground/60'
            href='/about-us'
          >
            about
          </Link>
          <Link
            className='transition-colors hover:text-foreground/80 text-foreground/60'
            href='/community'
          >
            community
          </Link>
        </nav>

        {/* Spacer */}
        <div className='flex-1' />

        {/* Right side actions */}
        <div className='flex items-center space-x-2'>
          {/* GitHub Link */}
          <Button variant='ghost' size='sm' asChild>
            <Link
              href='https://github.com/smartpylogger/smartpylogger'
              target='_blank'
              rel='noreferrer'
            >
              <Github className='h-4 w-4' />
              <span className='sr-only'>GitHub</span>
            </Link>
          </Button>

          {/* Theme toggle */}
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className='h-4 w-4' />
            <span className='sr-only'>Toggle theme</span>
          </Button>

          {/* Get Started Button - Desktop */}
          <Button
            variant='default'
            size='sm'
            className='hidden md:inline-flex'
            asChild
          >
            {isPending ? (
              <span className='text-white'>Loading...</span>
            ) : session ? (
              <Link href='/dashboard'>
                <span className='text-white'>Dashboard</span>
              </Link>
            ) : (
              <Link href='/login'>
                <span className='text-white'>Sign In</span>
              </Link>
            )}
          </Button>

          {/* Mobile Menu Drawer */}
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
              <Button variant='ghost' size='sm' className='md:hidden'>
                <Menu className='h-4 w-4' />
                <span className='sr-only'>Open menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <div className='flex items-center justify-between'>
                  <DrawerTitle>Navigation</DrawerTitle>
                  <DrawerClose asChild>
                    <Button variant='ghost' size='sm'>
                      <X className='h-4 w-4' />
                    </Button>
                  </DrawerClose>
                </div>
              </DrawerHeader>
              <div className='px-4 pb-6'>
                <nav className='flex flex-col space-y-4'>
                  <Link
                    className='text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60'
                    href='/docs'
                    onClick={() => setIsOpen(false)}
                  >
                    docs
                  </Link>
                  <Link
                    className='text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60'
                    href='/changelogs'
                    onClick={() => setIsOpen(false)}
                  >
                    changelogs
                  </Link>
                  <Link
                    className='text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60'
                    href='/about-us'
                    onClick={() => setIsOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link
                    className='text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60'
                    href='/community'
                    onClick={() => setIsOpen(false)}
                  >
                    community
                  </Link>
                  <div className='pt-4 border-t border-border/40'>
                    <Button
                      variant='default'
                      className='w-full'
                      onClick={() => setIsOpen(false)}
                      asChild
                    >
                      {isPending ? (
                        <span className='text-white'>Loading...</span>
                      ) : session ? (
                        <Link href='/dashboard'>
                          <span className='text-white'>Dashboard</span>
                        </Link>
                      ) : (
                        <Link href='/login'>
                          <span className='text-white'>Sign In</span>
                        </Link>
                      )}
                    </Button>
                  </div>
                </nav>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}
