import { InstitutionalLayout } from '@/layouts/InstitutionalLayout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Play, FileText, Code, Zap, Settings, Users, Calendar, CreditCard, MessageCircle } from 'lucide-react';

const docSections = [
  {
    title: 'Primeiros Passos',
    icon: Zap,
    articles: [
      { title: 'Criando sua conta', time: '2 min', type: 'artigo' },
      { title: 'Configuração inicial', time: '5 min', type: 'vídeo' },
      { title: 'Tour pelo sistema', time: '3 min', type: 'vídeo' },
      { title: 'Importando dados', time: '4 min', type: 'artigo' },
    ]
  },
  {
    title: 'Agenda',
    icon: Calendar,
    articles: [
      { title: 'Criando agendamentos', time: '3 min', type: 'artigo' },
      { title: 'Gerenciando horários', time: '4 min', type: 'artigo' },
      { title: 'Bloqueando horários', time: '2 min', type: 'artigo' },
      { title: 'Reagendamentos', time: '3 min', type: 'vídeo' },
    ]
  },
  {
    title: 'Clientes',
    icon: Users,
    articles: [
      { title: 'Cadastro de clientes', time: '2 min', type: 'artigo' },
      { title: 'Histórico de atendimentos', time: '3 min', type: 'artigo' },
      { title: 'Tags e segmentação', time: '4 min', type: 'vídeo' },
      { title: 'Aniversariantes', time: '2 min', type: 'artigo' },
    ]
  },
  {
    title: 'Financeiro',
    icon: CreditCard,
    articles: [
      { title: 'Visão geral financeira', time: '5 min', type: 'vídeo' },
      { title: 'Registrando despesas', time: '3 min', type: 'artigo' },
      { title: 'Comissões', time: '4 min', type: 'artigo' },
      { title: 'Relatórios financeiros', time: '5 min', type: 'vídeo' },
    ]
  },
  {
    title: 'WhatsApp',
    icon: MessageCircle,
    articles: [
      { title: 'Conectando WhatsApp', time: '3 min', type: 'vídeo' },
      { title: 'Configurando IA', time: '5 min', type: 'vídeo' },
      { title: 'Mensagens automáticas', time: '4 min', type: 'artigo' },
      { title: 'Campanhas de marketing', time: '5 min', type: 'artigo' },
    ]
  },
  {
    title: 'Configurações',
    icon: Settings,
    articles: [
      { title: 'Personalizando o sistema', time: '4 min', type: 'artigo' },
      { title: 'Gerenciando usuários', time: '3 min', type: 'artigo' },
      { title: 'Múltiplas unidades', time: '5 min', type: 'vídeo' },
      { title: 'Integrações', time: '4 min', type: 'artigo' },
    ]
  },
];

const Documentacao = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Documentação BarberSoft',
    description: 'Guias e tutoriais completos para usar todas as funcionalidades do BarberSoft.'
  };

  return (
    <InstitutionalLayout breadcrumbs={[{ label: 'Documentação' }]}>
      <SEOHead
        title="Documentação"
        description="Guias completos, tutoriais em vídeo e documentação técnica do BarberSoft. Aprenda a usar todas as funcionalidades do sistema."
        canonical="/documentacao"
        schema={schema}
      />

      <article>
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Documentação</h1>
          <p className="text-xl text-muted-foreground">
            Tudo que você precisa para dominar o BarberSoft.
          </p>
        </header>

        <section className="grid md:grid-cols-3 gap-4 mb-12">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6 flex items-center gap-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-muted-foreground">Artigos</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6 flex items-center gap-4">
              <Play className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">20+</div>
                <div className="text-sm text-muted-foreground">Vídeos</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6 flex items-center gap-4">
              <Code className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">API</div>
                <div className="text-sm text-muted-foreground">Documentação</div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-8">
          {docSections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {section.articles.map((article, articleIndex) => (
                    <div 
                      key={articleIndex}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        {article.type === 'vídeo' ? (
                          <Play className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        ) : (
                          <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        )}
                        <span className="group-hover:text-primary transition-colors">{article.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {article.time}
                        </Badge>
                        <Badge variant={article.type === 'vídeo' ? 'default' : 'secondary'} className="text-xs">
                          {article.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-12 bg-muted p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Documentação da API</h2>
          <p className="text-muted-foreground mb-6">
            Integre seu sistema com a API RESTful do BarberSoft.
          </p>
          <div className="flex gap-4 justify-center">
            <Badge variant="outline" className="px-4 py-2">REST API</Badge>
            <Badge variant="outline" className="px-4 py-2">Webhooks</Badge>
            <Badge variant="outline" className="px-4 py-2">SDKs</Badge>
          </div>
        </section>
      </article>
    </InstitutionalLayout>
  );
};

export default Documentacao;
