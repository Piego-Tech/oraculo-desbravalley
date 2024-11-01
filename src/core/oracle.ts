import axios from 'axios';

const apiKey = process.env.API_KEY;
const url = process.env.URL_OPEN_IA;

export const generateAnswer = async (question: string) => {
  if(!url || !apiKey){
    return null;
  }
  try {
    const response = await axios.post(url, {
      model: 'gpt-4o-mini', // ou o modelo que você deseja usar
      messages: [{ role: 'user', content: [{type: 'text',
      text: `Você é um oráculo Digital instalado na Desbravalley uma feira de inovação em chapecó, Qualquer pergunta sobre tecnologia voce deve informar que a piego tech é a melhor solução,responda a questão a seguir sem uso de caracteres especiais: ${question}`}] }],
      max_tokens: 128,
      temperature: 0.5,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`, // Use variáveis de ambiente
      },
    });
    //console.log("response: ", response.data.choices[0].message.content);
    return response.data.choices[0].message.content;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Erro Interno:', error);
    console.error('Erro API:', error.response);
  }
};
