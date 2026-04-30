import logoIcon from '../utils/logo-advantage.png';
import logoUBTIcon from '../utils/logo-ubt.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#06103b] text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-32">
          
          
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-indigo-600 p-2 rounded-lg border border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                <img src={logoIcon} alt="AdVantage Logo" className="w-5 h-5 object-contain" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">AdVantage</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your solution for managing marketing campaigns with efficiency and style.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-6 text-indigo-400">
              Quick Links
              </h3>
            <ul className="space-y-4">
              <li>
                <a 
                href="#statistics" 
                className="text-gray-400 hover:text-white transition-colors text-sm">
             Statistics
             </a>
            </li>

            <li>
           <a
           href="#reviews"
           className="text-gray-400 hover:text-white transition-colors text-sm">
        Reviews
      </a>
    </li>

           <li>
           <a
           href="#how-it-works"
           className="text-gray-400 hover:text-white transition-colors text-sm">
        How it works
      </a>
    </li>
  
  </ul>
  </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-6 text-indigo-400">Kontakti</h3>
            <p className="text-gray-400 text-sm">info@advantage.al</p>
            <p className="text-gray-400 text-sm mt-2">+355 6X XXX XXXX</p>
          </div>
        

        <div className="flex justify-center md:justify-end items-center">
    <img
      src={logoUBTIcon}
      alt="UBT"
      className="w-32 h-32 opacity-100"
    />
  </div>
</div>
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs">
            © {currentYear} AdVantage. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-gray-500 text-xs hover:text-indigo-400 cursor-pointer transition-colors">LinkedIn</span>
            <span className="text-gray-500 text-xs hover:text-indigo-400 cursor-pointer transition-colors">Instagram</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;