/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useEffect, useState } from 'react';
import './App.css'; // Import a CSS file for styling
import Image from 'next/image';

const Home = () => {
    const [text, setText] = useState('');
    const [returnText, setReturnText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [voices, setVoices] = useState([]);
    const [isRecording, setIsRecording] = useState(false);

    const startRecognition = async () => {
      // Verifica se a API é suportada
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error('Reconhecimento de fala não suportado pelo navegador.');
        return;
      }
    
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR'; // Define o idioma desejado
    
      recognition.onstart = () => {
        setIsRecording(true); // Muda o estado para não gravando
        console.log('Reconhecimento de fala iniciado.');
      };
    
      recognition.onresult = async (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setText(transcript);
        await handleSend();
        // Aqui você pode fazer algo com a transcrição
      };
    
      recognition.onerror = (event: SpeechRecognitionError) => {
        console.error('Erro de reconhecimento: ', event.error);
      };
    
      recognition.onend = () => {
        setIsRecording(false); // Muda o estado para não gravando
        console.log('Reconhecimento de fala finalizado.');
      };
    
      recognition.start(); // Inicia o reconhecimento
    };
    
  
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
        <div className='containerButtons'>
          <button className={`buttonMicrophone ${isRecording ? 'blinking' : ''}`} // Adiciona a classe blinking se estiver gravando
            onClick={startRecognition}
            style={{
              backgroundColor: isRecording ? '#F5F5F5' : '#995CF5'
            }}>
            <img src="/microphone_icon.svg" className='microphoneIcon' alt="Reconhecimento de fala" style={{ width: '30px', height: '20px' }} />
          </button>
          <button className="button" onClick={handleSend}>
            {isLoading ? <div className="loader" /> : <span className="buttonText">Enviar</span>}
          </button>
        </div>
      </div>
    );
};

export default Home;

