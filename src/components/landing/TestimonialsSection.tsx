import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Carlos Silva",
    role: "Dono da Barbearia Premium",
    avatar: "CS",
    rating: 5,
    text: "Com os lembretes automáticos, minhas faltas caíram 80%. O controle financeiro me mostra exatamente quanto cada barbeiro fatura.",
  },
  {
    name: "André Santos",
    role: "Barbearia Old School",
    avatar: "AS",
    rating: 5,
    text: "Gestão de comissões era um pesadelo. Agora é tudo automático e meus barbeiros confiam nos números. O relatório sai em segundos.",
  },
  {
    name: "Ricardo Oliveira",
    role: "Rede Barber King (3 unidades)",
    avatar: "RO",
    rating: 5,
    text: "Controlar 3 unidades era impossível. Com os relatórios multi-unidades, gerencio tudo do celular e comparo o desempenho de cada filial.",
  },
];

const partnerLogos = [
  "Barbearia Premium",
  "Old School",
  "Barber King",
  "The Gentlemen",
  "Corte & Estilo",
  "Barba Negra",
];

export function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="depoimentos" className="py-20 bg-charcoal/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-gold font-semibold text-sm uppercase tracking-wider">
            Depoimentos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Quem usa, recomenda
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Barbearias que transformaram sua gestão com o BarberSoft.
          </p>
        </div>

        {/* Partner Logos */}
        <div className="flex flex-wrap justify-center gap-8 mb-16 opacity-60">
          {partnerLogos.map((name, index) => (
            <div
              key={index}
              className="px-6 py-3 rounded-lg border border-border/30 bg-background/50"
            >
              <span className="text-muted-foreground font-medium">{name}</span>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`relative p-6 rounded-2xl bg-background border border-border/30 hover:border-gold/30 transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-gold/20" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                  <span className="text-gold font-bold">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}