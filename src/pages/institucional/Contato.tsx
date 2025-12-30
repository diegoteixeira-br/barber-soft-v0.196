import { InstitutionalLayout } from '@/layouts/InstitutionalLayout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MessageCircle, Clock, MapPin } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const Contato = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Mensagem enviada com sucesso! Retornaremos em breve.');
      setIsSubmitting(false);
    }, 1000);
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    mainEntity: {
      '@type': 'Organization',
      name: 'BarberSoft',
      email: 'contato@barbersoft.com.br',
      telephone: '+55-11-99999-9999'
    }
  };

  return (
    <InstitutionalLayout breadcrumbs={[{ label: 'Contato' }]}>
      <SEOHead
        title="Contato"
        description="Entre em contato com a equipe BarberSoft. Atendimento via WhatsApp, e-mail e formulário. Estamos prontos para ajudar sua barbearia a crescer."
        canonical="/contato"
        schema={schema}
      />

      <article>
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Fale Conosco</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Estamos aqui para ajudar. Entre em contato e nossa equipe responderá o mais rápido possível.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <MessageCircle className="h-10 w-10 text-primary mx-auto mb-4" />
              <CardTitle className="mb-2">WhatsApp</CardTitle>
              <CardDescription className="mb-4">Atendimento rápido e direto</CardDescription>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
                  (11) 99999-9999
                </a>
              </Button>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
              <CardTitle className="mb-2">E-mail</CardTitle>
              <CardDescription className="mb-4">Para dúvidas e parcerias</CardDescription>
              <Button variant="outline" className="w-full" asChild>
                <a href="mailto:contato@barbersoft.com.br">
                  contato@barbersoft.com.br
                </a>
              </Button>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="h-10 w-10 text-primary mx-auto mb-4" />
              <CardTitle className="mb-2">Horário</CardTitle>
              <CardDescription className="mb-4">Atendimento humanizado</CardDescription>
              <p className="text-sm font-medium">Seg - Sex: 9h às 18h</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <Card>
            <CardHeader>
              <CardTitle>Envie uma mensagem</CardTitle>
              <CardDescription>
                Preencha o formulário abaixo que entraremos em contato.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" placeholder="Seu nome" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" placeholder="(11) 99999-9999" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input id="subject" placeholder="Como podemos ajudar?" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Descreva sua dúvida ou solicitação..." 
                    rows={5}
                    required 
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Perguntas Frequentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1">Quanto tempo leva para receber resposta?</h4>
                  <p className="text-sm text-muted-foreground">
                    Respondemos em até 24 horas úteis. WhatsApp é mais rápido.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Vocês oferecem suporte por telefone?</h4>
                  <p className="text-sm text-muted-foreground">
                    Sim! Nosso time está disponível de segunda a sexta.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Como faço para cancelar minha assinatura?</h4>
                  <p className="text-sm text-muted-foreground">
                    Acesse Configurações no app ou entre em contato conosco.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Endereço</h4>
                    <p className="text-sm text-muted-foreground">
                      Av. Paulista, 1000 - Bela Vista<br />
                      São Paulo - SP, 01310-100
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </article>
    </InstitutionalLayout>
  );
};

export default Contato;
