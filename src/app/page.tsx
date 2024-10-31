/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useEffect, useState } from 'react';
import './App.css'; // Import a CSS file for styling
import Image from 'next/image';

//<Image src={'./src/openai.png'} width={90} height={100} alt="OpenAI Logo" className="logoOpenai" />
//
const Home = () => {
    const [text, setText] = useState('');
    const [returnText, setReturnText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [voices, setVoices] = useState([]);
  
    useEffect(() => {
      const getVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      // Chamar a função no carregamento do componente
      getVoices();

      // Adicionar um listener para quando as vozes mudarem
      window.speechSynthesis.onvoiceschanged = getVoices;

      return () => {
        window.speechSynthesis.onvoiceschanged = null; // Limpar o listener
      };
    }, []);

    const speakOracle = (text, language = 'pt-BR', voiceName = 'Rocko (Portuguese (Brazil))') => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
  
      const selectedVoice = voices.find(voice => voice.name === voiceName);
      if (selectedVoice) {
        utterance.voice = selectedVoice; // Define a voz selecionada
      }
  
      window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
      if (returnText) {
        speakOracle(returnText); // Chama a função de fala quando a resposta muda
      }
    }, [returnText]);

    const handleSend = async () => {
      setIsLoading(true);
      const answer = await callApi(text);
      if (answer && answer.answer) {
        setReturnText(`${answer.answer}\n`);
        speakOracle(answer.answer);
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    };
  
    async function callApi(question: string) {  
      const response = await fetch('./api/api/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({question}),
      });
  
      if (response.status !== 200) {
        window.confirm('Ocorreu um erro tente novamente');
        setIsLoading(false);
        setText('');
      }
      return await response.json();
    }
  
    return (
      <div className="container">
        <span className="plusText">{'Venha fazer sua pergunta para o ORÁCULO'}</span>
        <Image
          src="/giphy.webp" 
          alt="Gif"
          unoptimized
          width={300}
          height={300}
        />
        <span className="plusText">{''}</span>
        <Image
          src="/piegoBranca.png" 
          alt="Piego Logo"
          layout="intrinsic" // Usa o layout intrínseco
          width={200}
          height={200}
        />
        <div className="resultScroll">
          <p className="resultText">{returnText}</p>
        </div>
        <input
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Faça sua pergunta"
        />
        <button className="button" onClick={handleSend}>
          {isLoading ? <div className="loader" /> : <span className="buttonText">Enviar</span>}
        </button>
      </div>
    );
};

export default Home;

