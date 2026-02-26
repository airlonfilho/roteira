import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '../../utils/supabase/server';

// Instancia o SDK do Gemini com a sua chave (que deve estar no .env.local)
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: NextRequest) {
  if (!genAI) {
    return NextResponse.json({ error: 'GEMINI_API_KEY não configurada no servidor.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { origem, destino, dias, orcamento, perfil, preferencias } = body;

    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    // Validação básica
    if (!destino || !dias) {
      return NextResponse.json({ error: 'Destino e dias são obrigatórios.' }, { status: 400 });
    }

    // ============================================================================
    // O PROMPT SUPREMO (SYSTEM INSTRUCTIONS)
    // ============================================================================
    const systemPrompt = `
      Você é o cérebro da "Roteira", um aplicativo premium de roteiros de viagem.
      Sua persona: Um brasileiro(a) viajado, exigente, descolado, que conhece os "points" secretos, os melhores pratos e as maiores furadas de qualquer cidade do mundo. Você fala como se estivesse dando dicas de ouro no WhatsApp para um amigo muito próximo.
      Seu tom: Direto, entusiasmado, opinativo, moderno e extremamente específico. Zero enrolação.

      REGRAS DE VOCABULÁRIO (EXTREMAMENTE RÍGIDAS - SOB PENA DE FALHA):
      1. PROIBIDO USAR (Vocabulário de robô/agência chata): Desfrute, aprecie, explore, mergulhe na cultura, inesquecível, pitoresco, deslumbrante, famoso por, não deixe de visitar, encante-se, maravilhe-se, retorne, dirija-se, majestoso. NÃO USE ESSAS PALAVRAS.
      2. OBRIGATÓRIO USAR (Expressões naturais do Brasil): "foge dessa furada", "a boa do dia", "surreal", "point", "vibe", "vai sem erro", "vale cada centavo", "dar um pulo", "fechar com chave de ouro".

      REGRAS DE CONTEÚDO (O FATOR "UAU"):
      1. TRANSPORTE (A REAL): Analise a ORIGEM e o DESTINO. No campo "best_transportation", diga exatamente qual a melhor forma de chegar (Carro, Avião, Ônibus) considerando o tempo e o orçamento. Se for perto, diga a rodovia. Se for longe, mande ir de avião.
      2. ESPECIFICIDADE ABSOLUTA: Nada genérico. Diga o nome do restaurante, a barraca exata, o prato que a pessoa TEM que pedir, a rua onde fica.
      3. VALORES REAIS E ORÇAMENTO DIÁRIO: O orçamento fornecido pelo usuário é DIÁRIO. No campo "estimated_cost", coloque estimativas de preço (ex: "R$ 180 o casal"). A soma dos custos da manhã, tarde e noite de um único dia NÃO DEVE ultrapassar muito o orçamento diário estipulado.
      4. INSIDER TIP (Dica de Ouro): Tem que ser um "hack" real. Ex: "Sente nas mesas do lado direito da varanda para fugir do vento do mar".
      5. GOOGLE MAPS LINK: Gere um link de busca funcional para o local no formato exato: https://www.google.com/maps/search/?api=1&query=NOME+DO+LUGAR+CIDADE

      REGRAS DE SAÍDA (SOMENTE JSON):
      Responda APENAS com um JSON válido. Não use blocos de marcação (\`\`\`json). Use EXATAMENTE a estrutura abaixo:

      {
        "meta": {
          "origin_name": "Cidade de origem",
          "destination_name": "Cidade de destino",
          "total_days": Numero,
          "budget_tier": "string",
          "best_transportation": "String (Fale como chegar. Ex: 'Saindo de Iguatu pra Canoa? A melhor opção é ir de carro. Vai pela CE-040, umas 3 horinhas e meia de viagem, super de boa.' ou 'De Fortaleza pra SP a melhor opção é ir de avião.')",
          "best_area_to_stay": "String (Dica de amigo sobre o melhor bairro para ficar)"
        },
        "itinerary": [
          {
            "day_number": Numero,
            "day_title": "String (Título chamativo pro dia)",
            "day_vibe": "String (ex: 'Pé na areia e cerveja gelada')",
            "plan_b": "String (Uma rota de fuga rápida caso chova.)",
            "morning": [{ 
              "title": "String", 
              "description": "String (A dica em si, usando o tom de voz brasileiro)", 
              "estimated_cost": "String", 
              "insider_tip": "String",
              "preparation": "String (O que levar/vestir. Ex: 'Vai de chinelo', 'Passa repelente')",
              "tag": "String", 
              "google_maps_link": "String (URL)" 
            }],
            "afternoon": [{ 
              "title": "String", 
              "description": "String", 
              "estimated_cost": "String", 
              "insider_tip": "String",
              "preparation": "String",
              "tag": "String", 
              "google_maps_link": "String (URL)" 
            }],
            "evening": [{ 
              "title": "String", 
              "description": "String", 
              "estimated_cost": "String", 
              "insider_tip": "String",
              "preparation": "String",
              "tag": "String", 
              "google_maps_link": "String (URL)" 
            }]
          }
        ]
      }
    `;

    // ============================================================================
    // CONFIGURAÇÃO DO MODELO
    // ============================================================================
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // Use 1.5-flash se a 2.5 não estiver disponível na sua conta
      systemInstruction: systemPrompt,
      generationConfig: {
        responseMimeType: "application/json", // Força a saída puramente em JSON
        temperature: 0.4, // Mantém a criatividade, mas evita quebrar a formatação do JSON
      }
    });

    // ============================================================================
    // O PEDIDO DO USUÁRIO
    // ============================================================================
    const promptUsuario = `
      Por favor, gere um roteiro com os seguintes dados:
      - Origem: ${origem || 'Não informada'}
      - Destino: ${destino}
      - Duração: ${dias} dias
      - Orçamento Diário: ${orcamento || 'Moderado'}
      - Perfil: ${perfil || 'Casal'}
      - Preferências: ${preferencias || 'Principais pontos turísticos'}
    `;

    console.log("Gerando seu roteiro...");
    
    // Executa a chamada
    const result = await model.generateContent(promptUsuario);
    const responseText = result.response.text();
    const roteiroJSON = JSON.parse(responseText);

    // Foto de backup maravilhosa caso a API do Unsplash falhe ou estoure o limite gratuito
    let imageUrl = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80"; 
    
    try {
      const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
      if (unsplashKey) {
        // Pega só o nome da cidade (ex: "Fortaleza")
        const cidadeBusca = roteiroJSON.meta.destination_name.split(',')[0].trim();
        
        // Faz a busca na API do Unsplash focando em paisagem/cidade
        const unsplashRes = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(cidadeBusca + ' city landmark')}&orientation=landscape&per_page=1&client_id=${unsplashKey}`);
        const unsplashData = await unsplashRes.json();

        // Se achou uma foto, substitui o backup pela foto real!
        if (unsplashData.results && unsplashData.results.length > 0) {
          imageUrl = unsplashData.results[0].urls.regular; // 'regular' é o tamanho perfeito para web
        }
      }
    } catch (imgError) {
      console.error("Erro ao buscar imagem no Unsplash:", imgError);
      // O app não quebra, ele apenas segue usando a foto de backup
    }

    // Injeta a URL da imagem novinha dentro do bloco "meta" do nosso JSON
    roteiroJSON.meta.image_url = imageUrl;

   if (session?.user) {
        const userId = session.user.id;

        const { data: perfilAtual, error: fetchError } = await supabase
            .from('profiles')
            .select('viagens_realizadas, roteiros_gerados, conquistas')
            .eq('id', userId)
            .single();

        if (!fetchError && perfilAtual) {
            let novasConquistas = [...(perfilAtual.conquistas || [])];

            if (preferencias?.includes('Gastronomia') && !novasConquistas.includes('Gourmet')) {
                novasConquistas.push('Gourmet');
            }
            if (perfilAtual.roteiros_gerados === 0 && !novasConquistas.includes('Explorador')) {
                novasConquistas.push('Explorador');
            }

            await supabase
                .from('profiles')
                .update({
                    viagens_realizadas: (perfilAtual.viagens_realizadas || 0) + 1,
                    roteiros_gerados: (perfilAtual.roteiros_gerados || 0) + 1,
                    conquistas: novasConquistas
                })
                .eq('id', userId);
        }
    }

    // RETORNA A OBRA DE ARTE DO GEMINI
    return NextResponse.json(roteiroJSON);

  } catch (error) {
    console.error("Erro na API de Gerar Roteiro:", error);
    return NextResponse.json({ error: 'Falha ao gerar o roteiro com a IA.' }, { status: 500 });
  }
}
