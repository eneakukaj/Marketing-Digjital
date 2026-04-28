import React from 'react';
import MarketingImg from '../utils/home-page.png';

const Home = () => {
  const reviews = [
    { id: 1, name: "Hana B.", role: "Marketing Director", text: "AdVantage has completely transformed how we track our ROI. The real-time analytics dashboard is a game-changer for our team!" },
    { id: 2, name: "Elena R.", role: "Business Owner", text: "Finally, a platform that combines power with simplicity. The UI is incredibly intuitive, making campaign management feel effortless." },
    { id: 3, name: "Enea K.", role: "Digital Strategist", text: "The automated reporting feature saves us hours every week. I can't imagine running our digital strategy without AdVantage anymore." },
    { id: 4, name: "Sarah J.", role: "Agency Lead", text: "Performance and style in one package. The data visualization tools help us explain complex trends to our clients with ease." },
    { id: 5, name: "Vesa B.", role: "Software Engineer", text: "Top-tier security and seamless integration. It’s rare to find a marketing tool that is this robust yet so easy to deploy." },
    { id: 6, name: "Rina M.", role: "Growth Hacker", text: "Since switching to AdVantage, our conversion rates have increased by 25% thanks to their precision targeting insights." },
    
  ];

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
      
      <section className="max-w-[1440px] mx-auto px-10 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
            User <span className="relative inline-block mt-2">
              <span className="absolute -inset-3 bg-indigo-600/30 blur-2xl rounded-full"></span>
              <span className="relative text-indigo-400 font-black">
                REVIEWS
              </span>
            </span>
          </h2>
          <div className="h-1.5 w-24 bg-indigo-600 mx-auto rounded-full mt-6 shadow-[0_0_15px_rgba(99,102,241,0.8)]"></div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="relative group">
              {/* Animated Glow Backdrop */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              
              <div className="relative bg-[#161926] p-8 rounded-2xl border border-gray-800 hover:border-indigo-500/40 transition-all duration-300 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-indigo-400 mb-5 text-sm">
                    ★ ★ ★ ★ ★
                  </div>
                  <p className="text-gray-400 italic leading-relaxed mb-8">
                    "{review.text}"
                  </p>
                </div>
                
                <div className="border-t border-gray-800/50 pt-5">
                  <h4 className="font-bold text-white text-lg tracking-wide">{review.name}</h4>
                  <p className="text-indigo-400 text-sm font-medium uppercase tracking-wider">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


<section className="bg-[#0f111a] py-28 px-10">
  <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
    
    <div>
      <p className="text-indigo-400 font-bold uppercase tracking-[0.3em] mb-4">
        How It Works
      </p>

      <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
        Turn marketing data into smarter decisions.
      </h2>

      <p className="text-gray-400 text-lg max-w-xl mb-10 leading-relaxed">
        AdVantage helps teams create campaigns, track performance and improve results
        through one simple digital marketing workflow.
      </p>

      <div className="space-y-6">
        <div className="flex gap-5">
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">
            1
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Create Campaigns</h3>
            <p className="text-gray-400 mt-1">
              Set campaign goals, channels, budget and target audience.
            </p>
          </div>
        </div>

        <div className="flex gap-5">
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">
            2
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Track Performance</h3>
            <p className="text-gray-400 mt-1">
              Monitor clicks, views, conversions and campaign progress.
            </p>
          </div>
        </div>

        <div className="flex gap-5">
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">
            3
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Optimize Results</h3>
            <p className="text-gray-400 mt-1">
              Improve budget usage and increase return on investment.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="relative">
      <div className="absolute -inset-8 bg-indigo-600/20 blur-3xl rounded-full"></div>

      <div className="relative bg-[#06103b] border border-indigo-500/30 rounded-3xl p-8 shadow-2xl transition duration-500 transform hover:scale-105 hover:-translate-y-2">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-gray-400 text-sm">Campaign Dashboard</p>
            <h3 className="text-2xl font-bold text-white">Summer Growth Campaign</h3>
          </div>
          <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-bold">
            Active
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Clicks</p>
            <h4 className="text-3xl font-extrabold text-white mt-2">8.4K</h4>
          </div>

          <div className="bg-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Views</p>
            <h4 className="text-3xl font-extrabold text-white mt-2">42K</h4>
          </div>

          <div className="bg-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">ROI</p>
            <h4 className="text-3xl font-extrabold text-white mt-2">210%</h4>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Budget Usage</span>
              <span className="text-indigo-300">72%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[72%] bg-indigo-500 rounded-full"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Conversion Goal</span>
              <span className="text-indigo-300">58%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[58%] bg-indigo-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</section>
      {/* QITU I SHTONI PJEST TJERA DUHET KREJT PARA MBYLLJES TQETIJ DIV TFUNDIT */}
    </div>
  ); 
}; 

export default Home;