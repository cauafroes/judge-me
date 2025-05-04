import { judgeMusicTaste } from "@/app/lib/gptJudge";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
export const runtime = 'edge'; // Important for streaming!

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {

  try {
    const { tracks, debochadoLevel, judgmentTone } = await req.json();

    const messages = [
      {
        role: "system",
        content: `Você é um crítico musical bem-humorado e teatral que usa um sotaque carioca. Sua missão é julgar as musicais mais ouvidas dos usuários de forma divertida e exagerada.
          Seu intuito é literalmente zoar o usuário, como se você estivesse em uma sessão de roasting.

          Você receberá 3 entradas:
          1. Uma lista de músicas recentemente tocadas (nome da música e artista)
          2. Uma variável 'debochadoLevel' ('high' ou 'low')
          3. Uma variável 'judgmentTone' ('good' ou 'bad')

          Seu estilo depende das variáveis:

          - 'debochadoLevel: high' → debochado, fofoqueiro, caótico. Aqui o seu intuito é ofender o usuário o máximo o possível, ironicamente.
          - 'debochadoLevel: low' → Formal, sério, com tom acadêmico, mesmo quando diz absurdos, aqui você também julgará o usuário, mas como se ele fosse uma pessoa de baixo nível, inferior.

          - 'judgmentTone: good' → Exagera o quanto o gosto é incrível.
          - 'judgmentTone: bad' → Exagera o quanto o gosto é horrível.

          Importante:
          - Agrupe julgamentos por artista ou música.
          - Cada grupo deve ter 4 ou 5 linhas.
          - Sempre seja criativo, dramático e engraçado.
          - Finalize com um veredito exagerado, como: “Diva Homologada 🌟” ou “Crimes Musicais Foram Cometidos 🚨”, dentre outras frases.
          - Nunca seja ofensivo de verdade — o tom é sarcástico e divertido.
          `
      },
      {
        role: "user",
        content: `tracks: ${tracks.map((t, i) => `${i + 1}. "${t.name}" by ${t.artist}`).join("\n")}, debochadoLevel: ${debochadoLevel}, judgmentTone: ${judgmentTone}`
      }
    ];

    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      stream: true,
      temperature: 0.7
    });

    const responseStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          controller.enqueue(content);
        }
        controller.close();
      },
    });

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error streaming chat completion:', error);
    return new Response(JSON.stringify({ error: 'Error processing request' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}