import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTractor, faShoppingCart, faRobot, faChartLine, 
  faMobileAlt, faLeaf, faMapMarkerAlt, faPhoneAlt, 
  faEnvelope, faNewspaper
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebookF, faTwitter, faInstagram, faLinkedinIn 
} from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

// Import your agriculture images
import agri1 from '../../assets/agriculture1.png';
import agri2 from '../../assets/agriculture2.png';
import agri3 from '../../assets/agriculture3.png';
import agri4 from '../../assets/agriculture4.png';

const agricultureImages = [agri1, agri2, agri3, agri4];

function Landing() {
  const [activeStep, setActiveStep] = useState(0);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const steps = [
    {
      n: '01',
      hi: 'Register करें',
      en: 'Register & Verify',
      desc: 'Aadhaar से 2-मिनट KYC। Farmer या Buyer — profile तुरंत active।',
      icon: '🌱',
      code: '✓ Aadhaar verified\n✓ Bank account linked\n✓ GPS location set\n→ Profile is now LIVE!'
    },
    {
      n: '02',
      hi: 'Listing डालें',
      en: 'List Your Crops',
      desc: 'Photo upload करें, AI quality score पाएं, fair price suggestion मिलेगी।',
      icon: '📸',
      code: '🌾 Wheat · 50 Qtl\nAI Score: 94/100 ✓\nGrade: A Premium\n₹2,340/Qtl suggested'
    },
    {
      n: '03',
      hi: 'Negotiate करें',
      en: 'Negotiate & Close',
      desc: 'Multiple buyers की bids देखें, chat करें, best offer accept करें।',
      icon: '💬',
      code: 'Buyer A: ₹2,350/Qtl ⬆\nBuyer B: ₹2,330/Qtl\nBuyer C: ₹2,360/Qtl ⭐\n→ Best offer accepted!'
    },
    {
      n: '04',
      hi: 'Payment पाएं',
      en: 'Get Paid Instantly',
      desc: 'Escrow में secured payment — delivery confirm होते ही account में credit।',
      icon: '💰',
      code: '✓ ₹1,18,000 in escrow\n🚚 Pickup: Tomorrow 8AM\n✓ Delivered & confirmed\n✓ ₹1,18,000 CREDITED!'
    },
  ];

  useEffect(() => {
    // Load Google Translate script
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,hi',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element');
      }
    };

    // Fetch agriculture news
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=agriculture+india&apiKey=61c40eda66f14630a3fc9d4c6ed2e487&pageSize=4`
        );
        const data = await response.json();
        setNews(data.articles || []);
      } catch (error) {
        console.error("Error fetching news:", error);
        setNews([
          {
            title: "India's Agricultural Growth Reaches 3.5% in Q2",
            description: "Recent government data shows positive growth in agricultural sector.",
            url: "#",
            urlToImage: "https://via.placeholder.com/300x200?text=Agriculture+News",
            publishedAt: new Date().toISOString()
          },
          {
            title: "New Farming Techniques Boost Yield in Punjab",
            description: "Farmers adopting innovative methods see 20% increase in production.",
            url: "#",
            urlToImage: "https://via.placeholder.com/300x200?text=Agriculture+News",
            publishedAt: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();

    // Scroll reveal observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');
    revealElements.forEach(el => observer.observe(el));

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 100%)' }}>
      {/* Google Translate Widget */}
      <div id="google_translate_element" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, background: 'white', padding: '8px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}></div>

      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FontAwesomeIcon icon={faLeaf} size="2x" style={{ color: '#2e7d32', marginRight: '12px' }} />
          <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#1b5e20' }}>Krishiमित्र</span>
        </div>
        <Link to="/signin" style={{ background: '#2e7d32', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', transition: 'all 0.3s' }}>
          Sign In
        </Link>
      </header>

      {/* Hero Section */}
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ maxWidth: '800px', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px', color: '#1b5e20', lineHeight: '1.2' }}>
            Welcome to Krishiमित्र
            <br />
            <span style={{ color: '#2e7d32' }}>Connecting Farmers and Buyers</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#4a5b4a', lineHeight: '1.6' }}>
            Join our marketplace to buy and sell fresh, quality crops directly.
          </p>
        </div>

        {/* Register Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '800px', width: '100%', marginBottom: '60px' }}>
          <Link to="/register/farmer" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.07)', textAlign: 'center', transition: 'all 0.3s', cursor: 'pointer', border: '1px solid #e0e0e0' }}>
              <div style={{ width: '60px', height: '60px', background: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <FontAwesomeIcon icon={faTractor} size="xl" style={{ color: '#2e7d32' }} />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#1b5e20' }}>Register as a Farmer</h2>
              <p style={{ color: '#6b7280', marginBottom: '20px' }}>Sell your crops directly to buyers</p>
              <span style={{ display: 'inline-block', background: '#2e7d32', color: 'white', padding: '10px 24px', borderRadius: '8px', fontWeight: '500' }}>Register Now →</span>
            </div>
          </Link>

          <Link to="/register/buyer" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.07)', textAlign: 'center', transition: 'all 0.3s', cursor: 'pointer', border: '1px solid #e0e0e0' }}>
              <div style={{ width: '60px', height: '60px', background: '#e3f2fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <FontAwesomeIcon icon={faShoppingCart} size="xl" style={{ color: '#1976d2' }} />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#1b5e20' }}>Register as a Buyer</h2>
              <p style={{ color: '#6b7280', marginBottom: '20px' }}>Find and purchase quality crops</p>
              <span style={{ display: 'inline-block', background: '#1976d2', color: 'white', padding: '10px 24px', borderRadius: '8px', fontWeight: '500' }}>Register Now →</span>
            </div>
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <div style={{ background: 'white', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px', color: '#1b5e20' }}>Why Choose Krishiमित्र?</h2>
          <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '48px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            Our platform brings innovation to agriculture with cutting-edge features designed for modern farmers and buyers.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            <div style={{ padding: '32px', background: '#f9fafb', borderRadius: '16px', transition: 'all 0.3s' }}>
              <div style={{ width: '64px', height: '64px', background: '#ede7f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <FontAwesomeIcon icon={faRobot} size="xl" style={{ color: '#7c4dff' }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>AI Powered Crop Quality Analysis</h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>Leverage AI to assess crop quality, ensuring better transparency and trust.</p>
            </div>

            <div style={{ padding: '32px', background: '#f9fafb', borderRadius: '16px', transition: 'all 0.3s' }}>
              <div style={{ width: '64px', height: '64px', background: '#fff3e0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <FontAwesomeIcon icon={faChartLine} size="xl" style={{ color: '#f57c00' }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>Market Trends & Pricing</h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>Stay updated with real-time market trends for smarter buying and selling.</p>
            </div>

            <div style={{ padding: '32px', background: '#f9fafb', borderRadius: '16px', transition: 'all 0.3s' }}>
              <div style={{ width: '64px', height: '64px', background: '#e0f2fe', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <FontAwesomeIcon icon={faMobileAlt} size="xl" style={{ color: '#0284c7' }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>User-Friendly Application</h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>Enjoy a seamless and intuitive experience for easy participation.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div style={{ background: '#fef7e8', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ display: 'inline-block', background: 'rgba(200,98,42,0.1)', color: '#c8622a', padding: '6px 16px', borderRadius: '100px', fontSize: '12px', fontWeight: '500', marginBottom: '16px' }}>
              कैसे काम करता है
            </span>
            <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#3d2b1f', marginBottom: '16px' }}>
              4 steps में <span style={{ color: '#c8622a' }}>deal complete</span>
            </h2>
            <p style={{ fontSize: '16px', color: '#6b5a4e', maxWidth: '500px', margin: '0 auto' }}>
              कोई बिचौलिया नहीं। कोई hidden fee नहीं। Farm से buyer तक सीधा रास्ता।
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
            {/* Steps List */}
            <div>
              {steps.map((step, index) => (
                <div
                  key={step.n}
                  onClick={() => setActiveStep(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '16px 20px',
                    marginBottom: '8px',
                    borderRadius: '12px',
                    background: activeStep === index ? 'rgba(200,98,42,0.05)' : 'transparent',
                    border: activeStep === index ? '1.5px solid rgba(200,98,42,0.2)' : '1.5px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: activeStep === index ? 'rgba(200,98,42,0.15)' : 'rgba(200,98,42,0.08)',
                    border: `1px solid ${activeStep === index ? 'rgba(200,98,42,0.4)' : 'rgba(200,98,42,0.15)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#c8622a'
                  }}>
                    {step.n}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px', color: activeStep === index ? '#3d2b1f' : '#8b7a6a' }}>
                      {step.hi} <span style={{ fontSize: '13px', fontWeight: 'normal', color: '#8b7a6a' }}>({step.en})</span>
                    </h3>
                    {activeStep === index && (
                      <p style={{ fontSize: '13px', color: '#6b5a4e', lineHeight: '1.5', marginTop: '8px' }}>
                        {step.desc}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Live Preview Card */}
            <div style={{ position: 'relative' }}>
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: 'rgba(200,98,42,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px'
                  }}>
                    {steps[activeStep].icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#c8622a', fontFamily: 'monospace', marginBottom: '4px' }}>
                      STEP {steps[activeStep].n}
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#3d2b1f' }}>
                      {steps[activeStep].hi}
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', background: '#c8622a', color: 'white', padding: '4px 12px', borderRadius: '100px', fontSize: '10px', fontWeight: 'bold' }}>
                    LIVE
                  </div>
                </div>

                {/* Progress Bars */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                  {steps.map((_, i) => (
                    <div key={i} style={{ flex: 1, height: '4px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #c8622a, #e67e22)',
                        width: i <= activeStep ? '100%' : '0%',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  ))}
                </div>

                {/* Terminal */}
                <div style={{
                  background: '#1f2937',
                  borderRadius: '12px',
                  padding: '20px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  lineHeight: '1.6',
                  color: '#e5e7eb'
                }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                  </div>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '11px' }}>
                    {steps[activeStep].code}
                  </pre>
                </div>

                {/* Metrics */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <div style={{ flex: 1, background: '#f9fafb', padding: '12px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>Today's Wheat</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#c8622a' }}>₹2,340/Qtl</div>
                  </div>
                  <div style={{ flex: 1, background: '#f9fafb', padding: '12px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>Buyers Online</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#c8622a' }}>1,247</div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div style={{
                position: 'absolute',
                left: '-20px',
                top: '50px',
                background: 'white',
                padding: '12px 16px',
                borderRadius: '12px',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                border: '1px solid rgba(200,98,42,0.2)',
                animation: 'float 3s ease-in-out infinite'
              }}>
                <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>Punjab Wheat</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3d2b1f' }}>₹2,360</div>
                <div style={{ fontSize: '10px', color: '#22c55e' }}>▲ +1.8% today</div>
              </div>

              <div style={{
                position: 'absolute',
                right: '-20px',
                bottom: '80px',
                background: 'white',
                padding: '12px 16px',
                borderRadius: '12px',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                border: '1px solid rgba(212,148,26,0.2)',
                animation: 'float 4s ease-in-out infinite 1s'
              }}>
                <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>New Deal</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#d4941a' }}>🤝 50 Qtl Maize</div>
                <div style={{ fontSize: '10px', color: '#6b7280' }}>Bihar → Delhi</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agriculture in Action Section */}
      <div style={{ background: 'white', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px', color: '#1b5e20' }}>Agriculture in Action</h2>
          <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '48px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            See the vibrant community of farmers and buyers making agriculture thrive through our platform.
          </p>
          
          <div style={{ position: 'relative', height: '320px', width: '100%', overflow: 'hidden', marginBottom: '40px' }}>
            <div style={{ display: 'flex', gap: '24px', position: 'absolute', animation: 'scroll 30s linear infinite' }}>
              {[...agricultureImages, ...agricultureImages].map((img, index) => (
                <div key={index} style={{ flexShrink: 0, width: '280px', height: '280px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <img src={img} alt={`Agriculture ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
          
          <Link to="/register" style={{ display: 'inline-block', background: '#2e7d32', color: 'white', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '16px', transition: 'all 0.3s' }}>
            Join Our Growing Community →
          </Link>
        </div>
      </div>

      {/* News Section */}
      <div style={{ background: '#f9fafb', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <FontAwesomeIcon icon={faNewspaper} style={{ fontSize: '40px', color: '#2e7d32', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px', color: '#1b5e20' }}>Latest Agriculture News</h2>
          <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '48px' }}>
            Stay updated with the latest developments in Indian agriculture
          </p>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: '#2e7d32', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {news.slice(0, 4).map((article, index) => (
                <div key={index} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'all 0.3s' }}>
                  <img src={article.urlToImage || "https://via.placeholder.com/300x180?text=Agriculture+News"} alt={article.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1f2937', lineHeight: '1.4' }}>{article.title}</h3>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px', lineHeight: '1.5' }}>{article.description?.substring(0, 100)}...</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>{new Date(article.publishedAt).toLocaleDateString()}</span>
                      <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ color: '#2e7d32', fontSize: '12px', fontWeight: '500', textDecoration: 'none' }}>Read More →</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#1b5e20', color: 'white', padding: '60px 20px 30px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '40px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <FontAwesomeIcon icon={faLeaf} style={{ fontSize: '24px', marginRight: '10px' }} />
                <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Krishiमित्र</span>
              </div>
              <p style={{ color: '#c8e6c9', lineHeight: '1.6', fontSize: '14px' }}>
                Connecting farmers and buyers through innovative technology for a sustainable agricultural future.
              </p>
              <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                <a href="#" style={{ color: '#c8e6c9', transition: 'color 0.3s' }}><FontAwesomeIcon icon={faFacebookF} /></a>
                <a href="#" style={{ color: '#c8e6c9', transition: 'color 0.3s' }}><FontAwesomeIcon icon={faTwitter} /></a>
                <a href="#" style={{ color: '#c8e6c9', transition: 'color 0.3s' }}><FontAwesomeIcon icon={faInstagram} /></a>
                <a href="#" style={{ color: '#c8e6c9', transition: 'color 0.3s' }}><FontAwesomeIcon icon={faLinkedinIn} /></a>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Quick Links</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '8px' }}><Link to="/about" style={{ color: '#c8e6c9', textDecoration: 'none' }}>About Us</Link></li>
                <li style={{ marginBottom: '8px' }}><Link to="/marketplace" style={{ color: '#c8e6c9', textDecoration: 'none' }}>Marketplace</Link></li>
                <li style={{ marginBottom: '8px' }}><Link to="/pricing" style={{ color: '#c8e6c9', textDecoration: 'none' }}>Pricing</Link></li>
                <li style={{ marginBottom: '8px' }}><Link to="/blog" style={{ color: '#c8e6c9', textDecoration: 'none' }}>Blog</Link></li>
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Support</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '8px' }}><Link to="/faq" style={{ color: '#c8e6c9', textDecoration: 'none' }}>FAQ</Link></li>
                <li style={{ marginBottom: '8px' }}><Link to="/contact" style={{ color: '#c8e6c9', textDecoration: 'none' }}>Contact Us</Link></li>
                <li style={{ marginBottom: '8px' }}><Link to="/privacy" style={{ color: '#c8e6c9', textDecoration: 'none' }}>Privacy Policy</Link></li>
                <li style={{ marginBottom: '8px' }}><Link to="/terms" style={{ color: '#c8e6c9', textDecoration: 'none' }}>Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Contact Us</h3>
              <address style={{ fontStyle: 'normal', color: '#c8e6c9', fontSize: '14px', lineHeight: '1.8' }}>
                <p><FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px' }} /> 123 Farm Lane, Agricultural City, AG 12345</p>
                <p><FontAwesomeIcon icon={faPhoneAlt} style={{ marginRight: '8px' }} /> +1 (123) 456-7890</p>
                <p><FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px' }} /> info@krishimitr.com</p>
              </address>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #388e3c', paddingTop: '24px', textAlign: 'center', color: '#c8e6c9', fontSize: '14px' }}>
            <p>&copy; {new Date().getFullYear()} Krishiमित्र. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Add CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        .reveal-left, .reveal-right, .reveal-up {
          opacity: 0;
          transition: all 0.6s ease-out;
        }
        
        .reveal-left.visible {
          opacity: 1;
          transform: translateX(0);
        }
        
        .reveal-left {
          transform: translateX(-30px);
        }
        
        .reveal-right {
          transform: translateX(30px);
        }
        
        .reveal-right.visible {
          opacity: 1;
          transform: translateX(0);
        }
        
        .reveal-up {
          transform: translateY(30px);
        }
        
        .reveal-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .grid-cols-2 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Landing;