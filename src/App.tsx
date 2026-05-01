import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Builder } from './pages/Builder';
import './App.css';

function Header() {
  const location = useLocation();
  const isBuilder = location.pathname === '/builder';

  return (
    <header className="app-header">
      <div className="header-inner">
        <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span className="logo-icon">📢</span>
          <span className="logo-text">Ad Designer</span>
        </Link>
        <nav className="header-nav">
          {isBuilder ? (
            <>
              <span className="nav-badge google">Google</span>
              <span className="nav-badge meta">Meta</span>
              <span className="nav-badge lsa">LSA</span>
            </>
          ) : (
            <Link to="/builder" className="nav-builder-link">Open Builder →</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/builder" element={
            <main className="app-main">
              <Builder />
            </main>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
