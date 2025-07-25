import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./contexts/AuthContext"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { DashboardLayout } from "./components/DashboardLayout"
import { Dashboard } from "./pages/Dashboard"
import { LocationManagement } from "./pages/LocationManagement"
import { CreatePost } from "./pages/CreatePost"
import { ContentReview } from "./pages/ContentReview"
import { ApprovedPosts } from "./pages/ApprovedPosts"
import { PostHistory } from "./pages/PostHistory"
import { Settings } from "./pages/Settings"

function App() {
  console.log("App.tsx: App component rendering");

  try {
    console.log("App.tsx: Setting up providers and routing");
    
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="ui-theme">
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/test" element={
                  <div style={{ padding: '20px', color: 'black' }}>
                    <h1>Test Page - App is Working</h1>
                    <p>If you can see this, the React app is loading correctly.</p>
                    <a href="/login">Go to Login</a>
                  </div>
                } />
                <Route path="/" element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="locations" element={<LocationManagement />} />
                  <Route path="create-post" element={<CreatePost />} />
                  <Route path="review/:postId" element={<ContentReview />} />
                  <Route path="approved-posts" element={<ApprovedPosts />} />
                  <Route path="history" element={<PostHistory />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="*" element={
                  <div style={{ padding: '20px', color: 'black' }}>
                    <h1>Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                    <a href="/login">Go to Login</a>
                  </div>
                } />
              </Routes>
            </Router>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </div>
    );
  } catch (error) {
    console.error("App.tsx: Error in App component:", error);
    console.error("App.tsx: Error stack:", error.stack);
    
    // Return a simple error display instead of crashing
    return (
      <div style={{ 
        color: 'white', 
        backgroundColor: 'red', 
        padding: '20px', 
        fontFamily: 'monospace',
        minHeight: '100vh'
      }}>
        <h1>Application Error</h1>
        <p>Error: {error.message}</p>
        <pre>{error.stack}</pre>
      </div>
    );
  }
}

export default App