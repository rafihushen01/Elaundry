import React from 'react';

const Footer = () => {
  return (
    <footer className="relative bg-emerald-950 text-emerald-100 pt-16 pb-8 border-t-4 border-emerald-500 overflow-hidden">
      
      {/* Pure Code Animation: Floating Laundry Bubbles */}
      <style>
        {`
          @keyframes floatUp {
            0% { transform: translateY(100px) scale(0.5); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: translateY(-600px) scale(1.5); opacity: 0; }
          }
          .bubble-anim {
            animation: floatUp 8s infinite ease-in;
          }
          .delay-1 { animation-delay: 1.5s; }
          .delay-2 { animation-delay: 3.2s; }
          .delay-3 { animation-delay: 4.8s; }
          .delay-4 { animation-delay: 6.5s; }
        `}
      </style>

      {/* Bubble Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="bubble-anim absolute bottom-[-50px] left-[15%] w-10 h-10 bg-emerald-400 rounded-full opacity-20 blur-[1px]"></div>
        <div className="bubble-anim delay-1 absolute bottom-[-50px] left-[35%] w-6 h-6 bg-emerald-300 rounded-full opacity-20"></div>
        <div className="bubble-anim delay-2 absolute bottom-[-50px] left-[65%] w-14 h-14 bg-emerald-500 rounded-full opacity-20 blur-[2px]"></div>
        <div className="bubble-anim delay-3 absolute bottom-[-50px] left-[80%] w-8 h-8 bg-emerald-200 rounded-full opacity-20"></div>
        <div className="bubble-anim delay-4 absolute bottom-[-50px] left-[50%] w-12 h-12 bg-emerald-400 rounded-full opacity-20 blur-[1px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-white flex items-center gap-2 tracking-wide cursor-default group">
              <span className="text-emerald-400 group-hover:rotate-12 transition-transform duration-300 inline-block">e</span>
              Laundry
            </h2>
            <p className="text-emerald-200 text-sm leading-relaxed pr-4">
              Fresh, green, and pristine. We treat your clothes with eco-friendly care and deliver them right to your door with a smile.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4 pt-2">
              {[
                "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3.81l.39-4h-4.2V7a1 1 0 011-1h3z", // Facebook
                "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z", // Twitter
                "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 6.5h11a5 5 0 015 5v11a5 5 0 01-5 5h-11a5 5 0 01-5-5v-11a5 5 0 015-5z" // Instagram
              ].map((path, index) => (
                <a key={index} href="#" className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-white hover:-translate-y-2 transition-all duration-300 shadow-lg">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5">
                    <path d={path}></path>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              {['Wash & Fold', 'Dry Cleaning', 'Pricing Plans', 'Schedule Pickup'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-emerald-300 hover:text-white hover:pl-3 hover:border-l-2 border-emerald-400 pl-0 transition-all duration-300 inline-block">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Support</h3>
            <ul className="space-y-3">
              {['Help Center & FAQ', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-emerald-300 hover:text-white hover:pl-3 hover:border-l-2 border-emerald-400 pl-0 transition-all duration-300 inline-block">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Action */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Stay Fresh</h3>
            <p className="text-sm text-emerald-200 mb-4">Subscribe for special offers, discounts, and eco-friendly washing tips.</p>
            <form className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full bg-emerald-900/50 border border-emerald-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all duration-300 placeholder-emerald-600"
              />
              <button 
                type="button" 
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black tracking-wide py-3 px-4 rounded-lg transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]"
              >
                SUBSCRIBE NOW
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-800/60 pt-8 mt-4 flex flex-col md:flex-row justify-between items-center text-sm text-emerald-500">
          <p className="tracking-wide">&copy; {new Date().getFullYear()} e-Laundry. All rights reserved.</p>
          <p className="mt-4 md:mt-0 flex items-center gap-2 font-medium">
            Washed with <span className="animate-pulse text-emerald-300 text-lg">💚</span> for a cleaner planet
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;