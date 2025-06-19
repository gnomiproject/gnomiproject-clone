
// Add Google Analytics gtag to the Window interface
interface Window {
  gtag?: (command: string, action: string, params: any) => void;
  dataLayer?: any[];
}
