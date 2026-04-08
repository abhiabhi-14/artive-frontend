import { Link } from 'react-router-dom'
import { Camera, Instagram, Twitter, Github, Mail } from 'lucide-react'

const LINKS = {
  Explore: [
    { label: 'Gallery',      to: '/gallery' },
    { label: 'Events',       to: '/events' },
    { label: 'Testimonials', to: '/testimonials' },
  ],
  Club: [
    { label: 'Join Us',   to: '/register' },
    { label: 'Login',     to: '/login' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-[#1C1C1C] bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center">
                <Camera className="w-4 h-4 text-black" />
              </div>
              <span className="font-display text-xl font-bold text-[#F0F0F0]">
                Artive<span className="text-yellow-500">.</span>
              </span>
            </Link>
            <p className="text-sm text-[#555] leading-relaxed max-w-xs">
              A creative community where college artists and photographers come together to
              capture, share, and celebrate visual storytelling.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[
                { Icon: Instagram, href: '#' },
                { Icon: Twitter,   href: '#' },
                { Icon: Github,    href: '#' },
                { Icon: Mail,      href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-8 h-8 rounded-lg border border-[#2A2A2A] flex items-center justify-center text-[#555] hover:text-yellow-500 hover:border-yellow-500/40 transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#555] mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-[#666] hover:text-yellow-500 transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-[#1C1C1C] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#444]">
            © {new Date().getFullYear()} Artive Creative Club. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-xs text-[#444]">Inspiring creativity, one frame at a time.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
