
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Robots from "./pages/Robots";
import Map from "./pages/Map";
import Tasks from "./pages/Tasks";
import Settings from "./pages/Settings";
import Documentation from "./pages/Documentation";
import NotFound from "./pages/NotFound";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 10 * 1000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex h-screen bg-gray-50">
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/robots" element={<Robots />} />
                <Route path="/map" element={<Map />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
