import PropTypes from 'prop-types';
import BackButton from '@/components/backbutton';
import CustomCursor from '@/components/CustomCursor';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-x-hidden font-sans">
      <CustomCursor />
      
      {/* Film grain noise overlay */}
      <div className="noise-overlay" />
      
      <style>{`
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 80px;
        }
        
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        
        ::-webkit-scrollbar-thumb {
          background: #111827;
          border-radius: 0;
          border: 1px solid rgba(255,255,255,0.1);
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #1f2937;
        }
        
        * {
          transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 200ms;
        }
      `}</style>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {children}
      </div>
      
      <BackButton />
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};