'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiPhone } from 'react-icons/fi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/#araclar', label: 'Araçlarımız' },
    { href: '/#iletisim', label: 'İletişim' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-blue-900/10' 
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-shadow">
              <span className="text-white font-bold text-lg font-display">C</span>
            </div>
            <div className="flex flex-col">
              <span className={`font-display font-bold text-lg leading-none ${scrolled ? 'text-blue-900' : 'text-white'}`}>
                Cihan Motors
              </span>
              <span className={`text-xs font-medium tracking-widest uppercase ${scrolled ? 'text-blue-500' : 'text-blue-200'}`}>
                Oto Kiralama
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium text-sm tracking-wide transition-colors hover:text-blue-500 ${
                  scrolled ? 'text-slate-700' : 'text-white/90'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Phone CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:05324772447"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5"
            >
              <FiPhone size={16} />
              0532 477 24 47
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 shadow-xl"
          >
            <div className="px-4 py-4 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-3 px-4 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="tel:05324772447"
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold text-sm mt-2"
              >
                <FiPhone size={16} />
                0532 477 24 47 - Hemen Ara
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
