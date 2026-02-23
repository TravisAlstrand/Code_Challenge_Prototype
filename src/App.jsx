import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import ChallengeList from './pages/ChallengeList'
import AdminPage from './pages/AdminPage'
import StudentChallenge from './pages/StudentChallenge'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<ChallengeList />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/:id" element={<AdminPage />} />
            <Route path="/challenge/:id" element={<StudentChallenge />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  )
}
