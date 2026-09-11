import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class RootErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Critical Root Error caught by RootErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          width: '100%',
          backgroundColor: '#07080b',
          color: '#f4f4f5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '560px',
            backgroundColor: '#12141c',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              fontSize: '24px'
            }}>
              ⚙️
            </div>
            <span style={{
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#f59e0b',
              fontWeight: 700,
              fontFamily: 'monospace'
            }}>
              OIL INDIA LIMITED • SYSTEM SAFE RECOVERY
            </span>
            <h1 style={{
              fontSize: '20px',
              fontWeight: 800,
              margin: '10px 0 14px',
              color: '#ffffff'
            }}>
              Baghewala Digital Twin Recovery
            </h1>
            <p style={{
              fontSize: '13px',
              color: '#a1a1aa',
              lineHeight: 1.6,
              margin: '0 0 24px'
            }}>
              The digital twin interface caught a runtime exception during initialization. You can immediately reload the active telemetry stream or reset cached state.
            </p>
            {this.state.error && (
              <div style={{
                background: '#090a0f',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #27272a',
                color: '#f87171',
                fontFamily: 'monospace',
                fontSize: '11px',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '24px',
                maxHeight: '120px'
              }}>
                {String(this.state.error.message || this.state.error)}
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReload}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#09090b',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)'
                }}
              >
                Reload Digital Twin
              </button>
              <button
                onClick={this.handleResetAndReload}
                style={{
                  background: '#27272a',
                  color: '#e4e4e7',
                  border: '1px solid #3f3f46',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Clear Cache & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!window.__oilRootInstance) {
  window.__oilRootInstance = createRoot(rootElement);
}

window.__oilRootInstance.render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
);

