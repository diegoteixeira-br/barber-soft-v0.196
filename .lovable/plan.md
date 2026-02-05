
# Plano: Consolidar Páginas de Planos e Corrigir Erro de Checkout

## Problema Identificado

### 1. Erro de Checkout
A Edge Function `create-checkout-session` **não está deployada** no servidor. O teste direto retornou erro 404 (NOT_FOUND). A função existe no código mas precisa ser deployada.

### 2. Duas Páginas de Planos
Existem duas páginas quase idênticas:
- `/escolher-plano` (EscolherPlano.tsx) - Página standalone
- `/assinatura` (Assinatura.tsx) - Já tem os cards de planos integrados

O usuário quer manter apenas a página `/assinatura`.

---

## Arquitetura Atual vs Proposta

```text
ATUAL:
+------------------+     +------------------+
|  Trial Expirado  | --> | /escolher-plano  | --> Checkout (ERRO 404)
+------------------+     +------------------+
         |                       |
         v                       v
+------------------+     +------------------+
|   /assinatura    | --> |   Checkout       | --> Checkout (ERRO 404)
|  (com cards)     |     +------------------+
+------------------+

PROPOSTA:
+------------------+     +------------------+
|  Trial Expirado  | --> |   /assinatura    | --> Checkout (FUNCIONANDO)
+------------------+     |   (única página) |
                         +------------------+
```

---

## Etapa 1: Corrigir Erro de Checkout

**Ação:** Deploy da Edge Function `create-checkout-session`

A função já existe em `supabase/functions/create-checkout-session/index.ts` mas não está ativa no servidor. Será feito o deploy manual.

---

## Etapa 2: Consolidar em Uma Única Página

### 2.1 Remover página EscolherPlano

**Arquivo a deletar:** `src/pages/EscolherPlano.tsx`

### 2.2 Atualizar Rotas (App.tsx)

Remover a rota `/escolher-plano` do arquivo de rotas.

```text
Antes:
<Route path="/escolher-plano" element={<EscolherPlano />} />

Depois:
(removido)
```

### 2.3 Atualizar SubscriptionGuard

Modificar o botão "Escolher um Plano" na tela de "Período de Teste Expirado" para redirecionar para `/assinatura` ao invés de `/escolher-plano`.

```text
Antes:
navigate("/escolher-plano")

Depois:
navigate("/assinatura")
```

### 2.4 Atualizar paths exempts

Remover `/escolher-plano` da lista de paths exempts e garantir que `/assinatura` esteja na lista.

---

## Resumo das Alterações

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `supabase/functions/create-checkout-session/` | Deploy | Fazer deploy da função |
| `src/pages/EscolherPlano.tsx` | Deletar | Remover página duplicada |
| `src/App.tsx` | Modificar | Remover rota `/escolher-plano` e import |
| `src/components/auth/SubscriptionGuard.tsx` | Modificar | Redirecionar para `/assinatura` |

---

## Fluxo Final do Usuário

1. **Trial em andamento:** Acesso normal ao sistema, badge de "X dias restantes" visível
2. **Trial expirado:** Tela mostra "Período de Teste Expirado" → Botão leva para `/assinatura`
3. **Na página /assinatura:** Usuário vê cards de planos, seleciona um, checkout do Stripe abre
4. **Após pagamento:** Retorna para `/assinatura?checkout=success`, status atualizado

---

## Benefícios

1. **Experiência simplificada** - Uma única página para gerenciar assinatura
2. **Menos código** - Remoção de ~276 linhas duplicadas
3. **Menos confusão** - Usuário não precisa navegar entre páginas diferentes
4. **Checkout funcionando** - Edge function deployada e operacional
