import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Inicial",
    price: "99",
    description: "Perfeito para barbearias iniciantes",
    features: [
      "1 Unidade",
      "Até 3 Profissionais",
      "Agenda completa",
      "Dashboard financeiro",
      "Gestão de clientes",
      "Controle de serviços",
      "Suporte por email",
    ],
    highlighted: false,
  },
  {
    name: "Profissional",
    price: "199",
    description: "O mais escolhido pelos nossos clientes",
    features: [
      "Até 3 Unidades",
      "Profissionais ilimitados",
      "Integração WhatsApp",
      "Jackson IA (Atendente Virtual)",
      "Marketing e automações",
      "Comissões automáticas",
      "Controle de estoque",
      "Relatórios avançados",
      "Suporte prioritário",
    ],
    highlighted: true,
  },
  {
    name: "Franquias",
    price: "499",
    description: "Para redes com múltiplas unidades",
    features: [
      "Unidades ilimitadas",
      "Tudo do Profissional",
      "Relatórios multi-unidades",
      "API personalizada",
      "Gerente de conta dedicado",
      "Treinamento da equipe",
      "Personalização da marca",
    ],
    highlighted: false,
  },
];

export function PricingSection() {
  const { ref, isVisible } = useScrollAnimation();
  const navigate = useNavigate();

  return (
    <section id="precos" className="py-20 bg-background relative">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-gold font-semibold text-sm uppercase tracking-wider">
            Planos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Escolha o plano ideal para você
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Todos os planos incluem 7 dias grátis. Cancele quando quiser.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-6 transition-all duration-500 ${
                plan.highlighted
                  ? "bg-gradient-to-b from-gold/10 to-charcoal border-2 border-gold/50 shadow-xl shadow-gold/10 scale-105 z-10"
                  : "bg-charcoal/50 border border-border/30 hover:border-border/60"
              } ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-gold text-black text-sm font-semibold">
                    <Sparkles className="h-3 w-3" />
                    Recomendado
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-muted-foreground">R$</span>
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check
                      className={`h-4 w-4 flex-shrink-0 ${
                        plan.highlighted ? "text-gold" : "text-green-500"
                      }`}
                    />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.highlighted
                    ? "bg-gold hover:bg-gold/90 text-black font-semibold"
                    : "bg-muted hover:bg-muted/80"
                }`}
                onClick={() => navigate("/auth?tab=signup")}
              >
                Começar Agora
              </Button>
            </div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm">
            💰 Garantia de 30 dias ou seu dinheiro de volta. Sem perguntas.
          </p>
        </div>
      </div>
    </section>
  );
}