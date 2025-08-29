import logo from './logo.svg';
import './App.css';
// Replace the mockFirebase with real Firebase imports
import { auth, db } from './firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  onSnapshot 
} from 'firebase/firestore';

function App() {
  return (
    <div className="App">
      <h1 className='text-3xl font-bold text-red-500'>App</h1>
    </div>
  );
}

export default App;
