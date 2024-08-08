import React, { useEffect, useRef, useState } from 'react';

import './App.scss';
import shuffleArray from './suffleArray';
import { formatTime } from './formatTime';



function App() {
  const [sentences, setSentences] = useState([
    "Yo tengo el control.",
    "Tengo el control de mi vida, siempre lo he tenido.",
    "Hoy es el mejor momento de mejorar y aprender todo lo que siempre he querido.",
    "Puedo aprender cualquier habilidad y mejorar cualquier cosa.",
    "Si alguien más lo pudo hacer, yo lo puedo hacer mejor.",
    "21 años es la edad perfecta para ser el mexicano que cambió el mundo.",
    "Estoy dispuesto a ser el mejor, el Cesar número 1, es más yo invento un nuevo nivel.",
    "Yo nunca me rindo.",
  ])
  const [challenge, setChallenge] = useState([])
  const [challengeIdx, setChallengeIdx] = useState(0)

  const [escritor, setEscritor] = useState("") // en este vamos escribiendo frase por frase
  const [acumulado, setAcumulado] = useState("") // y en este vamos guardando las frases escritas para al final dividirlas en el minuto esccribiendo

  const intervalRef = useRef(null);
  const [timerOn, setTimerOn] = useState(false)
  const [counter, setCounter] = useState(0)

  const [result, setResult] = useState(null)





  const Escribiendo = (e) => {
    if (!timerOn) { // si es la primer letra escrita, activamos el contador
      setTimerOn(true)
    }

    const fraseEscrita = e.target.value;

    if (challengeIdx == 0) {
      if (challenge[challengeIdx] === fraseEscrita) {

        setChallengeIdx(prev => prev + 1)
        setAcumulado(challenge[challengeIdx])
        setEscritor("")
      } else {
        setEscritor(fraseEscrita)
      }


    } else {


      if (challenge[challengeIdx] === fraseEscrita) {

        setChallengeIdx(prev => prev + 1)
        setAcumulado(prev => prev + challenge[challengeIdx])
        setEscritor("")
      } else {
        setEscritor(fraseEscrita)
      }
    }

  };

  const handleReset = () => {
    setChallenge([])
    setChallengeIdx(0)
    setEscritor("")
    setAcumulado("")
    intervalRef.current = null
    setTimerOn(false)
    setCounter(0)
    setResult(null)
  }

  const frasesRef = useRef(null);






  useEffect(() => {
    if (challenge.length === 0 || challenge.length - challengeIdx == 140) { // si es la primer frase o si ya vas en las ultimas tres, generamos nuevas frases random.

      let _sentences = shuffleArray(sentences)

      _sentences = _sentences.join(" ") // juntamos frases completas
      _sentences = _sentences.split(" ") // dividimos todo por palabras
      _sentences = _sentences.join("- -") // juntamos frases completas
      _sentences = _sentences.split("-") // dividimos todo por palabras

      if (challenge.length === 0) {
        const _challenge = [...challenge, ..._sentences]
        setChallenge(_challenge)

      } else {

        const _challenge = [...challenge, " ", ..._sentences]
        setChallenge(_challenge)
      }
    }

  }, [challengeIdx, escritor])



  useEffect(() => {
    // aqui cuando entremos por primera vez vamos a activar el booleano de timer.
    //comienza un timer y cuando termine. bloqueamos el input, hacemos el calculo y damos el resultado en texto
    if (timerOn) {
      intervalRef.current = setInterval(() => {
        setCounter(prev => prev + 1)
      }, 1000)
    }

  }, [timerOn])



  useEffect(() => {
    if (counter >= 60) {
      clearInterval(intervalRef.current)
      const stat = acumulado.split(" ").length / 1
      setResult(stat + " WPM") // Palabras totales / Minutos
    }
  }, [counter])



  // aquí escuchamos el span con classname "CurrentSentence", cuando sale de la vista del cliente, hacemos un scroll en el padre para enfocarlo
  useEffect(() => {
    const checkPosition = () => {
      const currentSentence = document.querySelector('.currentSentence');
      if (currentSentence) {
        const rect = currentSentence.getBoundingClientRect();
        const containerRect = frasesRef.current.getBoundingClientRect();

        // Check if current sentence is out of the view
        if (rect.top < containerRect.top || rect.bottom > containerRect.bottom) {
          // Scroll the container to bring the current sentence into view
          currentSentence.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    // Listen for changes in the DOM (mutation observer)
    const observer = new MutationObserver(checkPosition);
    observer.observe(frasesRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    // Initial check
    checkPosition();

    return () => observer.disconnect();
  }, []);



  return (
    <div className="AppGrid">


      <div className='frasesContenedor'>
        <div className='frases' ref={frasesRef}>

          {
            challenge.map((sentence, idx) => <span className={challengeIdx == idx ? "currentSentence" : ""}>{sentence}</span>)
          }

        </div>
      </div>

      <div className='escritor'>
        <input
          value={escritor}
          onChange={e => Escribiendo(e)}
          disabled={counter >= 60}
        />
      </div>

      <div className='stats'>
        {
          result &&
          <React.Fragment>
            <h1>{result}</h1>
            <button className='refresh' onClick={handleReset}><i className='pi pi-refresh' /></button>
          </React.Fragment>
        }

        <h1>{formatTime(counter)}</h1>

      </div>


    </div>
  );
}

export default App;
