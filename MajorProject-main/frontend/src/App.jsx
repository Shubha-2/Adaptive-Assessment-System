import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateMCQ from './pages/CreateMCQ';
import Quizzes from './pages/Quizzes';
import TakeQuiz from './pages/TakeQuiz';
import Result from './pages/Result';
import Leaderboard from './pages/Leaderboard';
import Performance from './pages/Performance';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

// Layout Wrapper
const Layout = ({ children }) => {
  const location = useLocation();
  const isQuizPage = location.pathname.startsWith('/quiz/');

  return (
    <div className="min-h-screen flex flex-col">
      {!isQuizPage && <Navbar />}
      <main className={`flex-1 w-full ${!isQuizPage ? 'pt-24' : ''}`}>
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/generate" element={
            <ProtectedRoute>
              <Layout>
                <CreateMCQ />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/quizzes" element={
            <ProtectedRoute>
              <Layout>
                <Quizzes />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/quiz/:id" element={
            <ProtectedRoute>
              <Layout>
                <TakeQuiz />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/result/:id" element={
            <ProtectedRoute>
              <Layout>
                <Result />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/leaderboard/:id" element={
            <ProtectedRoute>
              <Layout>
                <Leaderboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/performance" element={
            <ProtectedRoute>
              <Layout>
                <Performance />
              </Layout>
            </ProtectedRoute>
          } />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
