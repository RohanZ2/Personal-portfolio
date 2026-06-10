'use client';

import React from 'react';
import TerminalPanel from '../TerminalPanel';

const inputClasses =
  'w-full bg-transparent border border-grid focus:border-phosphor focus:shadow-glow-green p-3 text-[12px] text-phosphor outline-none transition placeholder:text-phosphor/25';

export default function ContactSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-[1100px]">
      <TerminalPanel label="COMMS_UPLINK" className="lg:col-span-3">
        <h2 className="font-pixel text-sm text-phosphor text-glow mb-8">ESTABLISH UPLINK</h2>
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-[9px] tracking-[0.25em] text-phosphor/50 mb-2 uppercase">&gt;&gt; Name</label>
            <input type="text" placeholder="ENTER_IDENT..." className={inputClasses} />
          </div>
          <div>
            <label className="block text-[9px] tracking-[0.25em] text-phosphor/50 mb-2 uppercase">&gt;&gt; Frequency</label>
            <input type="email" placeholder="YOUR@EMAIL.COM" className={inputClasses} />
          </div>
          <div>
            <label className="block text-[9px] tracking-[0.25em] text-phosphor/50 mb-2 uppercase">&gt;&gt; Message</label>
            <textarea rows={4} placeholder="TRANSMIT_DATA..." className={inputClasses}></textarea>
          </div>
          <a
            href="mailto:rohantewari2009@gmail.com"
            className="block w-full text-center border border-phosphor text-phosphor py-3 text-[11px] tracking-[0.3em] uppercase hover:bg-phosphor hover:text-bg hover:shadow-glow-green transition"
          >
            [ Transmit Signal ]
          </a>
        </form>
      </TerminalPanel>

      <TerminalPanel label="CHANNEL_INFO" accent="magenta" className="lg:col-span-2 h-fit">
        <div className="space-y-6">
          <div>
            <div className="text-[9px] tracking-[0.25em] text-phosphor/40 uppercase mb-1.5">Direct Line</div>
            <a
              href="mailto:rohantewari2009@gmail.com"
              className="text-[11px] text-magenta hover:text-glow-magenta transition break-all"
            >
              rohantewari2009@gmail.com
            </a>
          </div>

          <div>
            <div className="text-[9px] tracking-[0.25em] text-phosphor/40 uppercase mb-3">External Feeds</div>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="w-11 h-11 border border-grid flex items-center justify-center text-phosphor/50 hover:border-magenta hover:text-magenta transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.203 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-11 h-11 border border-grid flex items-center justify-center text-phosphor/50 hover:border-magenta hover:text-magenta transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
            </div>
          </div>

          <div className="border-t border-grid pt-4 text-[9px] tracking-widest text-phosphor/30 uppercase">
            SIGNAL ENCRYPTION: AES-256<br />
            RESPONSE_TIME: ~24HRS
          </div>
        </div>
      </TerminalPanel>
    </div>
  );
}
