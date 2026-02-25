import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: NextRequest) {
  if (!genAI) return NextResponse.json({ error: 'API Key ausente' }, { status: 500 });

  try {
    const { destino } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Prompt super restrito para ele responder na velocidade da luz
    const prompt = `Me dê UMA ÚNICA curiosidade fascinante, divertida e pouco conhecida sobre a cidade de ${destino}. 
    Seja direto. Máximo de 2 frases curtas. Não use saudações. 
    Exemplo: Sabia que o farol de Canoa Quebrada foi construído blablabla?`;

    const result = await model.generateContent(prompt);
    
    return NextResponse.json({ dica: result.response.text() });

  } catch (error) {
    // Se a API engasgar, mandamos uma dica genérica de viagem pra não quebrar a tela
    return NextResponse.json({ 
      dica: "Sabia que viajar reduz o estresse e aumenta a criatividade de forma cientificamente comprovada?" 
    });
  }
}