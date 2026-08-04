import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.jsx'
import { ClerkProvider } from "@clerk/clerk-react";
import ApiProvider from './providers/ApiProvider.jsx';


const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <ApiProvider>
        <App />
      </ApiProvider>
    </ClerkProvider>
  </StrictMode>,
);
