import React from 'react';
import MarketingImg from '../utils/home-page.png';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0f111a] text-white">
      
      <section className="max-w-[1440px] mx-auto px-10 py-32 md:py-48 flex flex-col md:flex-row items-center gap-32">
        
        <div className="flex-1 text-center md:text-left">
          
          <h1 className="text-6xl md:text-8xl font-extrabold leading-tight mb-6 uppercase tracking-tighter">
            ADVANTAGE <br />

            <span className="relative inline-block">
              <span className="absolute -inset-3 bg-indigo-600/30 blur-2xl rounded-full"></span>

              <span className="relative text-indigo-400 font-black">
                MARKETING
              </span>
            </span>

          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
            Elevate your digital presence with high-performance campaign management 
            and real-time data analytics. Everything you need to scale your 
            business in one powerful platform.
          </p>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <button className="relative group bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold transition-all">
            
              <span className="absolute -inset-1 bg-indigo-500/40 blur-xl rounded-lg opacity-0 group-hover:opacity-100 transition duration-500"></span>
              
              <span className="relative">
                Get Started Now
              </span>

            </button>
          </div>

        </div>
        
        <div className="flex-1 w-full flex justify-center items-center">
          <div className="relative group w-full max-w-2xl">
            
            <div className="absolute -inset-10 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition duration-1000"></div>

            <img 
              src={MarketingImg} 
              alt="Marketing Illustration" 
              className="relative w-full h-auto transform group-hover:scale-105 transition duration-500"
            />

          </div>
        </div>

      </section>

<div className="w-full bg-white py-10 px-8">
  <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
    
    <div>
      <h3 className="text-5xl md:text-6xl font-extrabold text-[#06103b]">
        120+
      </h3>
      <p className="text-[#06103b]/80 text-base md:text-lg mt-3 font-medium">
        Campaigns Managed
      </p>
    </div>

    <div>
      <h3 className="text-5xl md:text-6xl font-extrabold text-[#06103b]">
        85%
      </h3>
      <p className="text-[#06103b]/80 text-base md:text-lg mt-3 font-medium">
        Growth Rate
      </p>
    </div>

    <div>
      <h3 className="text-5xl md:text-6xl font-extrabold text-[#06103b]">
        24/7
      </h3>
      <p className="text-[#06103b]/80 text-base md:text-lg mt-3 font-medium">
        Real-Time Analytics
      </p>
    </div>

    <div>
      <h3 className="text-5xl md:text-6xl font-extrabold text-[#06103b]">
        10K+
      </h3>
      <p className="text-[#06103b]/80 text-base md:text-lg mt-3 font-medium">
        Leads Generated
      </p>
    </div>

    <div>
      <h3 className="text-5xl md:text-6xl font-extrabold text-[#06103b]">
        50+
      </h3>
      <p className="text-[#06103b]/80 text-base md:text-lg mt-3 font-medium">
        Active Clients
      </p>
    </div>
</div>

</div>
      {/* QITU I SHTONI PJEST TJERA DUHET KREJT PARA MBYLLJES TQETIJ DIV TFUNDIT */}
    </div>
  ); 
}; 

export default Home;