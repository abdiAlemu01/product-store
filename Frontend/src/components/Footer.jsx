// Footer.jsx
import { PackageIcon, TruckIcon, ShieldCheckIcon, TagIcon } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-base-300 to-base-200 border-t-4 border-primary mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-full p-3">
                <PackageIcon className="size-6 text-primary-content" />
              </div>
              <div>
                <h3 className="font-bold text-lg">MANA GURGURTAA</h3>
                <p className="text-sm font-semibold">MEESHALE MANA CHARU TESFAYE</p>
              </div>
            </div>
            <p className="text-sm text-base-content/70 leading-relaxed">
              Mana gurgurta meeshalee mana amaansiisa kara online fi qaaman ni kenina
            </p>
            
            <div className="flex gap-3">
              {/* TikTok */}
              <a 
                href="https://www.tiktok.com/@manashoppingguide" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-circle btn-sm btn-outline hover:btn-primary"
                title="Follow us on TikTok"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              {/* Telegram */}
              <a 
                href="https://t.me/manashoppingguide" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-circle btn-sm btn-outline hover:btn-primary"
                title="Join us on Telegram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg flex items-center gap-2">
              <span className="text-primary">●</span>
              Kara qunamti safisa
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-base-content/70 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="text-xs">▸</span> Mana
                </a>
              </li>
              <li>
                <a href="/about" className="text-base-content/70 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="text-xs">▸</span> Waay'ee keenya
                </a>
              </li>
              <li>
                <a href="/services" className="text-base-content/70 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="text-xs">▸</span> Tajajiiloota keenya
                </a>
              </li>
              <li>
                <a href="/contact" className="text-base-content/70 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="text-xs">▸</span> Kaaralee qunamti keenya
                </a>
              </li>
              <li>
                <a href="/track-order" className="text-base-content/70 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="text-xs">▸</span> Meesha ajajuuf
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg flex items-center gap-2">
              <span className="text-primary">●</span>
              Taajajiiloota keenya
            </h4>
            <ul className="space-y-2">
              <li className="text-base-content/70 flex items-center gap-2">
                <TruckIcon className="size-4 text-primary" />
                Dhiyeesi hanga mana
              </li>
              <li className="text-base-content/70 flex items-center gap-2">
                <ShieldCheckIcon className="size-4 text-primary" />
                Bakka jirtan teesani ajajachu
              </li>
              <li className="text-base-content/70 flex items-center gap-2">
                <TagIcon className="size-4 text-primary" />
                Meesha baay'ee ajajachuuf
              </li>
             
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg flex items-center gap-2">
              <span className="text-primary">●</span>
              Kaaraleen qunamti keenya
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="font-medium text-sm">Lakkoofsa Bilbila</p>
                  <p className="text-base-content/70 text-sm">09 54 74 65 80 33</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="font-medium text-sm">Iddon argama keenya</p>
                  <p className="text-base-content/70 text-sm leading-relaxed">
                    Maagala Leeman daandii guudda irra<br/>
                    Naanawa agilgillooti
                  </p>
                </div>
              </li>
              <li>
                <a href="/contact" className="btn btn-primary btn-sm w-full">
                  Send Message
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-base-content/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
