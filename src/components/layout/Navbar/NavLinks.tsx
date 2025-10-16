import Link from 'next/link';

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: '/explore', label: 'Explore' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQ' },
  { href: '/blog', label: 'Blog' },
  { href: '/my-voice-models', label: 'My Voice Models' },
  { href: '/generation-history', label: 'Generation History' },
];

export default function NavLinks() {
  return (
    <div className="hidden md:flex items-center space-x-8">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}