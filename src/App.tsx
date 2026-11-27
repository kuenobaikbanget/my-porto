import { ContactFooter } from './components/ContactFooter';
import { ExperienceBento } from './components/ExperienceBento';
import { HeroBento } from './components/HeroBento';
import { HobbiesBento } from './components/HobbiesBento';
import { Navbar } from './components/Navbar';
import { ProjectsBento } from './components/ProjectsBento';
import { TechStackBento } from './components/TechStackBento';

function App() {
  return (
    <div className="min-h-screen text-[#f3edf7]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <HeroBento />
        <ProjectsBento />
        <ExperienceBento />
        <TechStackBento />
        <HobbiesBento />
        <ContactFooter />
      </main>
    </div>
  );
}

export default App;
