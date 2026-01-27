

# Programa de Fidelidade Configuravel - Valor Minimo

## Resumo

Adicionar uma configuracao para o dono da barbearia definir o valor minimo que um servico precisa ter para contar como "corte" no programa de fidelidade. Atualmente estava fixo em R$30, mas cada barbearia pode ter precos diferentes.

## Alteracoes

### 1. Banco de Dados

Adicionar nova coluna na tabela `business_settings`:

| Coluna | Tipo | Default | Descricao |
|--------|------|---------|-----------|
| `fidelity_min_value` | numeric | 30.00 | Valor minimo do servico para contar como corte |

### 2. Interface de Configuracao

Na aba "Fidelidade" (`FidelityTab.tsx`), adicionar novo campo:

```text
+------------------------------------------+
|  Programa de Fidelidade                  |
+------------------------------------------+
|  [x] Ativar programa de fidelidade       |
|                                          |
|  Cortes para ganhar cortesia: [10]       |
|                                          |
|  Valor minimo do servico: R$ [30,00]  <-- NOVO
|  Servicos abaixo desse valor nao contam  |
|                                          |
|  [!] Como funciona:                      |
|  - Servicos acima de R$30 contam         |
|  - Cortesias NAO contam                  |
|  - ...                                   |
+------------------------------------------+
```

### 3. Trigger do Banco de Dados

Atualizar a funcao `sync_client_on_appointment_complete` para:
- Buscar o valor minimo configurado (`fidelity_min_value`)
- Verificar se `total_price >= fidelity_min_value`
- Excluir cortesias da contagem

```text
Fluxo de decisao:
  Agendamento finalizado
         |
         v
  Valor >= valor_minimo_configurado?
         |
     [Sim]
         v
  E cortesia?
         |
     [Nao]
         v
  Incrementar contador de fidelidade
```

## Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| Nova migracao SQL | Adicionar coluna `fidelity_min_value` |
| Nova migracao SQL | Atualizar trigger com regras de validacao |
| `src/hooks/useBusinessSettings.ts` | Adicionar campo no tipo |
| `src/components/configuracoes/FidelityTab.tsx` | Campo para configurar valor minimo |

## Detalhes Tecnicos

### Migracao 1 - Nova Coluna
```sql
ALTER TABLE public.business_settings
ADD COLUMN fidelity_min_value numeric DEFAULT 30.00;
```

### Migracao 2 - Trigger Atualizado
O trigger buscara o `fidelity_min_value` das configuracoes e aplicara:
- `NEW.total_price >= fidelity_min_value`
- `NEW.payment_method NOT IN ('courtesy', 'fidelity_courtesy')`

### Interface TypeScript
```typescript
interface BusinessSettings {
  // ... campos existentes
  fidelity_min_value: number | null;
}
```

## Resultado Esperado

Apos implementacao:
- Dono da barbearia pode definir o valor minimo (ex: R$25, R$35, R$50)
- A interface mostra claramente qual valor esta configurado
- O trigger usa esse valor para decidir se o corte conta
- Cortesias nunca contam, independente do valor

