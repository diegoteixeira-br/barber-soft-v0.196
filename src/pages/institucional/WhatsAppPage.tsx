import { InstitutionalLayout } from '@/layouts/InstitutionalLayout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Clock, CheckCircle, Users, Zap, Shield } from 'lucide-react';

const WhatsAppPage = () => {
  const whatsappLink = 'https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o BarberSoft.';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contato WhatsApp BarberSoft',
    description: 'Entre em contato com o BarberSoft via WhatsApp para suporte e informações.'
  };

  return (
    <InstitutionalLayout breadcrumbs={[{ label: 'WhatsApp' }]}>
      <SEOHead
        title="Fale Conosco no WhatsApp"
        description="Atendimento rápido via WhatsApp. Tire dúvidas, solicite suporte ou conheça o BarberSoft. Resposta em poucos minutos."
        canonical="/whatsapp"
        schema={schema}
      />

      <article>
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
            <MessageCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Fale Conosco no WhatsApp</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Atendimento rápido e humanizado. Estamos prontos para ajudar você.
          </p>
        </header>

        <section className="max-w-2xl mx-auto mb-12">
          <Card className="bg-green-500/5 border-green-500/20">
            <CardContent className="pt-8 text-center">
              <p className="text-lg mb-6">
                Clique no botão abaixo para iniciar uma conversa com nossa equipe.
              </p>
              <Button 
                size="lg" 
                className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-6 h-auto"
                asChild
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-6 w-6" />
                  Iniciar Conversa
                </a>
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                (11) 99999-9999
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="h-10 w-10 text-primary mx-auto mb-4" />
              <CardTitle className="mb-2">Resposta Rápida</CardTitle>
              <CardDescription>
                Tempo médio de resposta de 5 minutos durante horário comercial.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-10 w-10 text-primary mx-auto mb-4" />
              <CardTitle className="mb-2">Suporte Humanizado</CardTitle>
              <CardDescription>
                Equipe treinada para resolver suas dúvidas com atenção.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <CheckCircle className="h-10 w-10 text-primary mx-auto mb-4" />
              <CardTitle className="mb-2">Resolução Eficiente</CardTitle>
              <CardDescription>
                95% dos casos resolvidos na primeira interação.
              </CardDescription>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">O que você pode fazer via WhatsApp</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              'Tirar dúvidas sobre o sistema',
              'Solicitar suporte técnico',
              'Conhecer planos e preços',
              'Agendar demonstração',
              'Solicitar treinamento',
              'Reportar problemas',
              'Sugestões de melhorias',
              'Parcerias comerciais'
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Horário de Atendimento</h2>
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Segunda a Sexta</span>
                  <span className="font-medium">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábado</span>
                  <span className="font-medium">09:00 - 13:00</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Domingo e Feriados</span>
                  <span>Fechado</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4 pt-4 border-t">
                Fora do horário? Deixe sua mensagem que respondemos assim que possível.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <Card className="bg-muted">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Zap className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Atendimento Automatizado</h3>
                  <p className="text-sm text-muted-foreground">
                    Nossa IA responde perguntas frequentes 24/7. Para casos específicos, 
                    um atendente humano assume a conversa.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Segurança</h3>
                  <p className="text-sm text-muted-foreground">
                    Nunca solicitamos senhas ou dados de cartão via WhatsApp. 
                    Suas informações estão protegidas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </article>
    </InstitutionalLayout>
  );
};

export default WhatsAppPage;
