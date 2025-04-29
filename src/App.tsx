import  { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ChatButton from './components/ChatButton';
import ChatPanel from './components/ChatPanel';
import Overlay from './components/Overlay';
import LanguageToggle from './components/LanguageToggle';
// Components
import LoadingScreen from './components/LoadingScreen';
import Layout from './components/Layout';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BadgesPage from './pages/BadgesPage';
import Level1Page from './pages/levels/Level1Page';
import Level2Page from './pages/levels/Level2Page';
import Level3Page from './pages/levels/Level3Page';
import Level4Page from './pages/levels/Level4Page';
import Level5Page from './pages/levels/Level5Page';
import Level6Page from './pages/levels/Level6Page';
import Level7Page from './pages/levels/Level7Page';
import TranslatorPage from './pages/TranslatorPage';
import SummarizerPage from './pages/SummarizerPage';
import ExplorerPage from './pages/ExplorerPage';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  useEffect(() => {
    // Simulate loading resources
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen  />;
  }

  return (
    
      <Layout>
      {!isChatOpen && <LanguageToggle />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/badges" element={<BadgesPage />} />
          <Route path="/level/1" element={<Level1Page />} />
          <Route path="/level/2" element={<Level2Page />} />
          <Route path="/level/3" element={<Level3Page />} />
          <Route path="/level/4" element={<Level4Page />} />
          <Route path="/level/5" element={<Level5Page />} />
          <Route path="/level/6" element={<Level6Page />} />
          <Route path="/level/7" element={<Level7Page />} />
          <Route path="/translator" element={<TranslatorPage />} />
          <Route path="/summarizer" element={<SummarizerPage />} />
          <Route path="/explorer" element={<ExplorerPage />} />
        </Routes>
        
        <ChatButton isOpen={isChatOpen} onClick={toggleChat} />
        <ChatPanel isOpen={isChatOpen} onClose={toggleChat} />
        <Overlay isVisible={isChatOpen} onClick={toggleChat} />
      </AnimatePresence>
    </Layout>
    

    
  );
}

export default App;