import Header from './components/Header';
import Profile from './components/Profile';
import Hobbies from './components/Hobbies';
import Skills from './components/Skills';
import SocialMedia from './components/SocialMedia';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Profile />
        <Hobbies />
        <Skills />
        <SocialMedia />
      </main>
      <Footer />
    </div>
  );
}

export default App;
