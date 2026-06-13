import { AppProvider } from './context/AppContext'
import { useReveal } from './hooks/useReveal'
import ReconBackground from './components/ReconBackground'
import Nav from './components/Nav'
import Hero from './components/Hero'
import AgentLinkage from './components/AgentLinkage'
import Core from './components/Core'
import Footer from './components/Footer'

function Page() {
  useReveal()
  return (
    <>
      <ReconBackground />
      <Nav />
      <main>
        <Hero />
        <AgentLinkage />
        <Core />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Page />
    </AppProvider>
  )
}
