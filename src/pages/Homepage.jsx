import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  BarChartOutlined, 
  DashboardOutlined, 
  TrophyOutlined, 
  TeamOutlined,
  RocketOutlined,
  PlayCircleOutlined,
  MenuOutlined,
  CloseOutlined,
  DownOutlined,
  LeftOutlined,
  RightOutlined,
  LineChartOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  RobotOutlined,
  ShareAltOutlined,
  BulbOutlined,
  SettingOutlined,
  DollarOutlined,

} from '@ant-design/icons';
import { Button, Card } from 'antd';
import mascort from '../assets/moscot.png';
import '../styles/Homepage.scss';
import FAQSection from '../components/common/FAQSection';
import Footer from '../components/common/Footer';
import FreeTrialForm from '../components/common/FreeTrialForm';

// Constants moved outside component to prevent recreating on each render
const ROTATING_TEXTS = ['Ad Networks', 'Ad Agencies', 'Brands'];
const TEXT_ROTATION_INTERVAL = 2000;
const SCROLL_THRESHOLD = 50;

const TOOLKIT_CARDS = [
  {
    id: 'Campaign Management',
    title: 'Campaign Management',
    icon: <SettingOutlined />,
    description: 'Comprehensive campaign creation, management and optimization platform',
    features: [
      'Multi-channel campaign management',
      'Real-time performance tracking',
      'Automated reporting and insights',
      'Customizable dashboards',
      'A/B testing and optimization tools',
      'Audience segmentation and targeting'
    ],
  },
  {
    id: 'Marketing Analytics',
    title: 'Marketing Analytics',
    icon: <LineChartOutlined />,
    description: 'Advanced analytics and performance tracking for marketing campaigns',
    features: [
      'Real-time campaign performance monitoring',
      'Advanced audience segmentation and insights',
      'Multi-channel attribution tracking',
      'Custom dashboard creation and reporting',
      'ROI and conversion rate optimization',
      'A/B testing and performance comparison'
    ]
  },
  {
    id: 'Automated Payout',
    title: 'Automated Payout',
    icon: <DollarOutlined />,
    description: 'Streamlined payment processing and commission management',
    features: [
      'Automated commission calculations',
      'Multi-currency payment support',
      'Real-time payout tracking',
      'Customizable payment schedules',
      'Secure payment gateway integration',
      'Detailed payment history and reporting'
    ]
  },
  {
    id: 'Easy Automation',
    title: 'Easy Automation',
    icon: <RobotOutlined />,
    description: 'Smart workflow automation for marketing processes',
    features: [
      'Drag-and-drop workflow builder',
      'Trigger-based campaign automation',
      'Email marketing automation sequences',
      'Social media posting automation',
      'Lead nurturing workflows',
      'Automated reporting and notifications'
    ]
  },
  {
    id: 'Fraud Detection',
    title: 'Fraud Detection',
    icon: '',
    description: 'AI-powered fraud prevention and security monitoring',
    features: [
      'Real-time fraud detection algorithms',
      'Suspicious activity monitoring',
      'Click fraud prevention',
      'Traffic quality analysis',
      'Automated threat response',
      'Compliance and security reporting'
    ]
  }
];

const NAVIGATION_ITEMS = [
  { label: 'Platform', href: '#platform' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Resources', href: '#resources' },
  { label: 'Why Afftrex', href: '#why-afftrex' }
];

// Memoized components for better performance
const FeatureList = React.memo(({ features }) => (
  <div className="card-features">
    {features.map((feature, index) => (
      <div key={index} className="feature-item">
        <span className="feature-bullet">•</span>
        <span className="feature-text">{feature}</span>
      </div>
    ))}
  </div>
));

const ToolkitCard = React.memo(({ card, position, index, onClick }) => {
  const isActive = position === 'current';
  
  return (
    <div 
      className={`toolkit-card ${position}-card ${isActive ? 'active' : ''}`}
      onClick={() => !isActive && onClick(index)}
      style={{ cursor: !isActive ? 'pointer' : 'default' }}
    >
      <div className="card-header">
        <div className="card-icon">
          {card.icon}
        </div>
        <h3 className="card-title">{card.title}</h3>
      </div>
      
      <div className="card-description">
        <p>{card.description}</p>
      </div>
      
      <FeatureList features={card.features} />
      
      {isActive && (
        <Button 
          type="primary" 
          size="large" 
          className="try-free-btn"
        >
          Learn More
        </Button>
      )}
    </div>
  );
});

const NavigationItem = React.memo(({ item, index }) => (
  <div key={index} className="nav-item">
    <a href={item.href} className="nav-link">
      {item.label}
      {item.label !== 'Pricing' && <DownOutlined className="nav-arrow" />}
    </a>
  </div>
));

const Homepage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentText, setCurrentText] = useState(0);
  const [currentCard, setCurrentCard] = useState(0);

  // Memoized scroll handler
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  // Optimized event listeners
  useEffect(() => {
    let ticking = false;
    
    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [handleScroll]);

  // Text rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % ROTATING_TEXTS.length);
    }, TEXT_ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Memoized navigation handlers
  const handlePrevCard = useCallback(() => {
    setCurrentCard((prev) => (prev === 0 ? TOOLKIT_CARDS.length - 1 : prev - 1));
  }, []);

  const handleNextCard = useCallback(() => {
    setCurrentCard((prev) => (prev === TOOLKIT_CARDS.length - 1 ? 0 : prev + 1));
  }, []);

  const handleTabClick = useCallback((index) => {
    setCurrentCard(index);
  }, []);

  const handleCardClick = useCallback((index) => {
    setCurrentCard(index);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  // Memoized visible cards calculation
  const visibleCards = useMemo(() => {
    const totalCards = TOOLKIT_CARDS.length;
    
    const prevIndex = currentCard === 0 ? totalCards - 1 : currentCard - 1;
    const nextIndex = currentCard === totalCards - 1 ? 0 : currentCard + 1;
    
    return [
      { ...TOOLKIT_CARDS[prevIndex], position: 'prev', index: prevIndex },
      { ...TOOLKIT_CARDS[currentCard], position: 'current', index: currentCard },
      { ...TOOLKIT_CARDS[nextIndex], position: 'next', index: nextIndex }
    ];
  }, [currentCard]);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const openForm = () => {setIsFormOpen(true); console.log("ddd"); }
  const closeForm = () => setIsFormOpen(false);

  return (
    <div className="afftrex-homepage">
      {/* Header */}
      <header className={`afftrex-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <div className="logo">
            <a href="/" className="logo-link">AFFTREX</a>
          </div>
          
          <nav className="nav-menu">
            {NAVIGATION_ITEMS.map((item, index) => (
              <NavigationItem key={item.label} item={item} index={index} />
            ))}
          </nav>

          <div className="header-actions">
            <a href="./Login" className="request-demo-btn">
              Sign in 
            </a>
            <button onClick={openForm} className="free-trial-btn">
              Free Trial
            </button>
          </div>

          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              Partner Marketing Platform
            </div>
            
            <h1 className="hero-title">
              One Platform-<br />
              Multiple Solutions for<br />
              <span className="highlight rotating-text">
                {ROTATING_TEXTS[currentText]}
              </span>
            </h1>
            
            <p className="hero-description">
              Afftrex's partner marketing platform streamlines your marketing efforts, 
              offering detailed reports that provide a complete view of your campaign 
              performance for smarter decision-making.
            </p>
            
            <div className="cta-buttons">
              <a href="#demo" className="book-demo-btn">
                Book a Demo
              </a>
              <a href="#platform" className="explore-platform-btn">
                Explore the Platform
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="mascot-container">
              <img 
                src={mascort} 
                alt="Afftrex Mascot" 
                className="mascot-image"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Toolkits Section */}
      <section className="toolkits-section">
        <div className="toolkits-container">
          <div className="toolkits-header">
            <h2 className="toolkits-title">Elevate Partnerships, Amplify Performance</h2>
            
            <div className="toolkits-tabs">
              {TOOLKIT_CARDS.map((card, index) => (
                <button
                  key={card.id}
                  className={`toolkit-tab ${index === currentCard ? 'active' : ''}`}
                  onClick={() => handleTabClick(index)}
                >
                  {card.title}
                </button>
              ))}
            </div>
          </div>

          <div className="toolkits-content">
            <button 
              className="nav-button prev-button" 
              onClick={handlePrevCard}
              aria-label="Previous card"
            >
              <LeftOutlined />
            </button>

            <div className="toolkit-cards-carousel">
              {visibleCards.map((card) => (
                <div 
                  key={`${card.id}-${card.position}`}
                  className={`card-wrapper ${card.position}`}
                >
                  <ToolkitCard 
                    card={card} 
                    position={card.position} 
                    index={card.index}
                    onClick={handleCardClick}
                  />
                </div>
              ))}
            </div>

            <button 
              className="nav-button next-button" 
              onClick={handleNextCard}
              aria-label="Next card"
            >
              <RightOutlined />
            </button>
          </div>
        </div>
      </section>
      
      <FAQSection />

      <FreeTrialForm isOpen={isFormOpen} onClose={closeForm} />
      <Footer/>
    </div>
  );
};

export default Homepage;