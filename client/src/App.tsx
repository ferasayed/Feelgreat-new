import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";

// Lazy-loaded routes for code splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Partner = lazy(() => import("./pages/Partner"));
const Founder = lazy(() => import("./pages/Founder"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const HealthConditionsList = lazy(() => import("./pages/HealthConditions").then(m => ({ default: m.HealthConditionsList })));
const PillarPagesList = lazy(() => import("./pages/PillarPage").then(m => ({ default: m.PillarPagesList })));
const PillarPageDetail = lazy(() => import("./pages/PillarPage").then(m => ({ default: m.PillarPageDetail })));
const HealthConditionDetail = lazy(() => import("./pages/HealthConditions").then(m => ({ default: m.HealthConditionDetail })));
const HealthAssessment = lazy(() => import("./pages/HealthAssessment"));
const BusinessOpportunity = lazy(() => import("./pages/BusinessOpportunity"));
const About = lazy(() => import("./pages/About"));
const KeywordReport = lazy(() => import("./pages/KeywordReport"));
const GrowthDashboard = lazy(() => import("./pages/GrowthDashboard"));
const LeadMagnet = lazy(() => import("./pages/LeadMagnet"));
const PartnerWithFeras = lazy(() => import("./pages/PartnerWithFeras"));
const HealthInvestor = lazy(() => import("./pages/HealthInvestor"));
const Reviews = lazy(() => import("./pages/Reviews"));
const JourneyRoadmap = lazy(() => import("./pages/JourneyRoadmap"));
const SuccessStories = lazy(() => import("./pages/SuccessStories"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/dashboard"} component={Dashboard} />
        <Route path={"/faq"} component={FAQ} />
        <Route path={"/partner"} component={Partner} />
        <Route path={"/founder"} component={Founder} />
        <Route path={"/blog"} component={Blog} />
        <Route path={"/blog/:slug"} component={BlogArticle} />
        <Route path={"/health"} component={HealthConditionsList} />
        <Route path={"/topics"} component={PillarPagesList} />
        <Route path={"/topics/:slug"} component={PillarPageDetail} />
        <Route path={"/health/:slug"} component={HealthConditionDetail} />
        <Route path={"/health-assessment"} component={HealthAssessment} />
        <Route path={"/business-opportunity"} component={BusinessOpportunity} />
        <Route path={"/about"} component={About} />
        <Route path={"/keywords"} component={KeywordReport} />
        <Route path={"/growth"} component={GrowthDashboard} />
        <Route path={"/assessments"} component={LeadMagnet} />
        <Route path={"/partner-with-feras"} component={PartnerWithFeras} />
        <Route path={"/health-investor"} component={HealthInvestor} />
        <Route path={"/reviews"} component={Reviews} />
        <Route path={"/90-day-journey"} component={JourneyRoadmap} />
        <Route path={"/success-stories"} component={SuccessStories} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
