'use client';

import { useState, useEffect } from 'react';
import Logo from '@/components/ui/Logo';
import NavLinks from './NavLinks';
import LanguageSwitcher from './LanguageSwitcher';
import LoginButton from './LoginButton';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Navigation Links */}
          <NavLinks />

          {/* Right Section: Language & Login */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <LoginButton />
          </div>

          {/* Mobile Menu Button - TODO: Implement mobile menu */}
          <button className="md:hidden p-2 text-gray-700 hover:text-purple-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}