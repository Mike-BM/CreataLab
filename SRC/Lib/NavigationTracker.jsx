// NavigationTracker - Removed Base44 dependencies
// This component can be used for custom analytics tracking if needed
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function NavigationTracker() {
    const location = useLocation();

    // Track page views for analytics (if needed)
    useEffect(() => {
        // Add custom analytics tracking here if needed
        // Example: Google Analytics, custom analytics service, etc.
        const pathname = location.pathname;
        
        // Placeholder for future analytics implementation
        if (typeof window !== 'undefined' && window.gtag) {
            // Example: window.gtag('config', 'GA_MEASUREMENT_ID', { page_path: pathname });
        }
    }, [location]);

    return null;
}
