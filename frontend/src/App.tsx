import {useEffect, useState} from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import {Greet} from "../wailsjs/go/main/App";
import { EventsOn, EventsOff } from "../wailsjs/runtime";

function App() {
    const [resultText, setResultText] = useState("Please enter your name below 👇");
    const [clipboardMsg, setClipboardMsg] = useState("CLIPBOARD");
    const [name, setName] = useState('');
    const updateName = (e: any) => setName(e.target.value);
    const updateResultText = (result: string) => setResultText(result);

    function greet() {
        Greet(name).then(updateResultText);
    }

  useEffect(() => {
    EventsOn("clipboard-change", setClipboardMsg);

    return () => {
      EventsOff("clipboard-change");
    }
  }, []);

    return (
        <div id="App">
            <img src={logo} id="logo" alt="logo"/>
            <div id="result" className="result">{resultText}</div>
          <div className="result">{clipboardMsg}</div>
            <div id="input" className="input-box">
                <input id="name" className="input" onChange={updateName} autoComplete="off" name="input" type="text"/>
                <button className="btn" onClick={greet}>Greet</button>
            </div>
        </div>
    )
}

export default App
