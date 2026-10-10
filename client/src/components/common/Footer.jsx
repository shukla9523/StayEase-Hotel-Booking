import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, Heart, Shield, Award, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
                <Compass className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Stay<span className="text-teal-400">Ease</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Discover curated luxury stays, heritage havelis, and beachfront escapes across India.
              Seamless booking, transparent pricing, and instant confirmation for every journey.
            </p>
            <div className="flex items-center gap-4 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-teal-400" />
                <span>Verified Hotels</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-teal-400" />
                <span>Best Rate Promise</span>
              </div>
            </div>
          </div>

          {/* Popular Destinations */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide mb-4">Destinations</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/hotels?city=Jaipur" className="hover:text-teal-400 transition-colors">
                  Jaipur Heritage Haveli
                </Link>
              </li>
              <li>
                <Link to="/hotels?city=Goa" className="hover:text-teal-400 transition-colors">
                  Goa Beach Resorts
                </Link>
              </li>
              <li>
                <Link to="/hotels?city=Delhi" className="hover:text-teal-400 transition-colors">
                  Delhi Luxury Stays
                </Link>
              </li>
              <li>
                <Link to="/hotels?city=Mumbai" className="hover:text-teal-400 transition-colors">
                  Mumbai Sea View
                </Link>
              </li>
              <li>
                <Link to="/hotels?city=Udaipur" className="hover:text-teal-400 transition-colors">
                  Udaipur Lake Palaces
                </Link>
              </li>
              <li>
                <Link to="/hotels?city=Manali" className="hover:text-teal-400 transition-colors">
                  Manali Pine Chalets
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/about" className="hover:text-teal-400 transition-colors">
                  About StayEase
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-teal-400 transition-colors">
                  Help & FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-teal-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-teal-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide mb-4">Support 24/7</h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                <span>+91 1800-STAYEASE</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                <span>support@stayease.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span>Connaught Place, New Delhi, India 110001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} StayEase Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 text-[11px] bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive Demo Sandbox active. Stripe test payments & instant demo verification.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
