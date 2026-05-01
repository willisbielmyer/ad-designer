import { Builder } from './pages/Builder';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">📢</span>
            <span className="logo-text">Ad Designer</span>
          </div>
          <nav className="header-nav">
            <span className="nav-badge google">Google</span>
            <span className="nav-badge meta">Meta</span>
            <span className="nav-badge lsa">LSA</span>
          </nav>
        </div>
      </header>
      <main className="app-main">
        <Builder />
      </main>
    </div>
  );
}

export default App;
