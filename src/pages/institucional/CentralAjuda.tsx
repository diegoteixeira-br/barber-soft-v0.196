import { InstitutionalLayout } from '@/layouts/InstitutionalLayout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, Calendar, Users, CreditCard, Settings, MessageCircle, BookOpen, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const categories = [
  { icon: Calendar, title: 'Agendamentos', description: 'Como gerenciar sua agenda', count: 12 },
  { icon: Users, title: 'Clientes', description: 'Cadastro e gestão de clientes', count: 8 },
  { icon: CreditCard, title: 'Financeiro', description: 'Pagamentos e relatórios', count: 15 },
  { icon: Settings, title: 'Configurações', description: 'Personalize seu sistema', count: 10 },
  { icon: Smartphone, title: 'WhatsApp', description: 'Integração e automações', count: 7 },
  { icon: BookOpen, title: 'Primeiros Passos', description: 'Comece a usar o BarberSoft', count: 5 },
];

const faqs = [
  {
    question: 'Como faço para criar um novo agendamento?',
    answer: 'Acesse a aba Agenda, clique no botão "+ Novo Agendamento" ou diretamente no horário desejado no calendário. Preencha os dados do cliente, serviço e profissional, e confirme.'
  },
  {
    question: 'Como configurar o atendente de IA no WhatsApp?',
    answer: 'Vá em Configurações > Integrações > WhatsApp. Clique em "Conectar WhatsApp" e escaneie o QR Code com seu celular. Após conectar, ative o atendente de IA nas configurações de automação.'
  },
  {
    question: 'Como ver os relatórios financeiros?',
    answer: 'Acesse a aba Financeiro para ver receitas, despesas e comissões. Você pode filtrar por período, profissional e unidade. Exporte relatórios em PDF ou Excel.'
  },
  {
    question: 'Posso ter mais de uma unidade no mesmo sistema?',
    answer: 'Sim! O BarberSoft suporta múltiplas unidades. Vá em Configurações > Unidades para adicionar novas lojas. Cada unidade tem seus próprios profissionais, serviços e agenda.'
  },
  {
    question: 'Como recuperar um cliente inativo?',
    answer: 'Use a funcionalidade de Marketing > Campanhas de Resgate. O sistema identifica automaticamente clientes que não visitam há X dias e envia mensagens personalizadas.'
  },
  {
    question: 'Posso personalizar as mensagens automáticas?',
    answer: 'Sim! Em Configurações > Mensagens, você pode personalizar confirmações, lembretes, mensagens de aniversário e campanhas de resgate com variáveis dinâmicas.'
  },
  {
    question: 'Como adicionar um novo profissional?',
    answer: 'Acesse Profissionais > Novo Profissional. Preencha nome, telefone, foto e defina a cor do calendário. Configure também a taxa de comissão individual.'
  },
  {
    question: 'O sistema funciona offline?',
    answer: 'O BarberSoft é um sistema web e requer conexão com a internet. Porém, carregamentos são rápidos e o sistema é otimizado para funcionar mesmo em conexões lentas.'
  }
];

const CentralAjuda = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <InstitutionalLayout breadcrumbs={[{ label: 'Central de Ajuda' }]}>
      <SEOHead
        title="Central de Ajuda"
        description="Encontre respostas para suas dúvidas sobre o BarberSoft. FAQ, tutoriais e guias para agendamentos, financeiro, WhatsApp e mais."
        canonical="/ajuda"
        schema={schema}
      />

      <article>
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Central de Ajuda</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Como podemos ajudar você hoje?
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Buscar por dúvidas, tutoriais..."
              className="pl-12 py-6 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Categorias</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-muted-foreground">{category.count} artigos</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Perguntas Frequentes</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                <AccordionTrigger className="text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          {filteredFaqs.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Nenhum resultado encontrado para "{searchQuery}"
            </p>
          )}
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <Card className="bg-muted">
            <CardContent className="pt-6 text-center">
              <MessageCircle className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Precisa de mais ajuda?</h3>
              <p className="text-muted-foreground mb-4">
                Nosso time de suporte está pronto para ajudar via WhatsApp.
              </p>
              <Button asChild>
                <Link to="/whatsapp">Falar com Suporte</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-muted">
            <CardContent className="pt-6 text-center">
              <BookOpen className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Documentação Completa</h3>
              <p className="text-muted-foreground mb-4">
                Guias detalhados e tutoriais em vídeo para cada funcionalidade.
              </p>
              <Button variant="outline" asChild>
                <Link to="/documentacao">Ver Documentação</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </article>
    </InstitutionalLayout>
  );
};

export default CentralAjuda;
