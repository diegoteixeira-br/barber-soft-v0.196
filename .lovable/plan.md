
# Ajustar Mensagem Inicial do Jackson - Mais Genérica

## Problema Identificado

A mensagem inicial do Jackson lista funcionalidades específicas:
- Atendimento Rápido
- WhatsApp
- Agenda
- Financeiro
- Marketing

Isso passa a impressão de que o suporte é limitado a esses tópicos.

## Solução

Modificar o `SYSTEM_PROMPT` na edge function para que a primeira mensagem seja mais simples e genérica, deixando claro que o Jackson pode ajudar com **qualquer dúvida** sobre o sistema.

## Nova Mensagem Inicial (Sugerida)

```text
Olá! 👋 Sou o Jackson, seu assistente virtual do BarberSoft.

Estou aqui para te ajudar com qualquer dúvida sobre o sistema!

Só me conta o que você precisa. 💈
```

Ou ainda mais curta:

```text
Olá! 👋 Sou o Jackson, assistente do BarberSoft.

Me conta sua dúvida - posso ajudar com qualquer funcionalidade do sistema!
```

## Alteração Técnica

### Arquivo: `supabase/functions/support-chat/index.ts`

Modificar a seção "Exemplos de Perguntas que Posso Responder" do SYSTEM_PROMPT:

**De:**
```
## Exemplos de Perguntas que Posso Responder
- "Como registro um corte fora do horário?"
- "Como conecto o WhatsApp?"
- ...
```

**Para:**
```
## Primeira Interação
Na primeira mensagem, seja breve e acolhedor. NÃO liste funcionalidades específicas.
Apenas diga que está disponível para ajudar com qualquer dúvida sobre o sistema.

Exemplo de primeira mensagem:
"Olá! 👋 Sou o Jackson, seu assistente do BarberSoft. Me conta sua dúvida - posso ajudar com qualquer funcionalidade do sistema!"

## Exemplos de Perguntas que Você Sabe Responder (use apenas quando relevante)
- Como usar cada funcionalidade
- Como resolver problemas
- Dúvidas sobre configurações
- Qualquer aspecto do BarberSoft
```

## Resultado Esperado

| Antes | Depois |
|-------|--------|
| Lista 5 funcionalidades específicas | Mensagem genérica e acolhedora |
| Parece suporte limitado | Parece suporte completo |
| Texto longo | Texto curto e direto |

## Arquivo a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `supabase/functions/support-chat/index.ts` | Ajustar SYSTEM_PROMPT para mensagem inicial genérica |
