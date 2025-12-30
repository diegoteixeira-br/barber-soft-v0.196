import { InstitutionalLayout } from '@/layouts/InstitutionalLayout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    id: 1,
    title: '10 Dicas para Aumentar o Faturamento da Sua Barbearia',
    excerpt: 'Descubra estratégias comprovadas para atrair mais clientes e aumentar o ticket médio do seu negócio.',
    category: 'Gestão',
    date: '28 Dez 2024',
    readTime: '5 min',
    image: '/placeholder.svg'
  },
  {
    id: 2,
    title: 'Como a IA Está Revolucionando o Atendimento em Barbearias',
    excerpt: 'Entenda como a inteligência artificial pode automatizar seu atendimento no WhatsApp e aumentar conversões.',
    category: 'Tecnologia',
    date: '25 Dez 2024',
    readTime: '7 min',
    image: '/placeholder.svg'
  },
  {
    id: 3,
    title: 'Marketing Digital para Barbearias: Guia Completo 2025',
    excerpt: 'Aprenda a usar redes sociais, Google Meu Negócio e WhatsApp Marketing para atrair clientes.',
    category: 'Marketing',
    date: '20 Dez 2024',
    readTime: '10 min',
    image: '/placeholder.svg'
  },
  {
    id: 4,
    title: 'Tendências de Cortes Masculinos para 2025',
    excerpt: 'Os estilos que estarão em alta no próximo ano e como preparar sua equipe para atendê-los.',
    category: 'Tendências',
    date: '15 Dez 2024',
    readTime: '4 min',
    image: '/placeholder.svg'
  },
  {
    id: 5,
    title: 'Como Reduzir Faltas e Cancelamentos na Sua Barbearia',
    excerpt: 'Estratégias eficazes de confirmação automática e política de cancelamento que funcionam.',
    category: 'Gestão',
    date: '10 Dez 2024',
    readTime: '6 min',
    image: '/placeholder.svg'
  },
  {
    id: 6,
    title: 'Gestão Financeira: Controle de Comissões e Despesas',
    excerpt: 'Organize as finanças da sua barbearia e tenha clareza sobre lucros e despesas mensais.',
    category: 'Financeiro',
    date: '5 Dez 2024',
    readTime: '8 min',
    image: '/placeholder.svg'
  }
];

const categories = ['Todos', 'Gestão', 'Tecnologia', 'Marketing', 'Tendências', 'Financeiro'];

const Blog = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog BarberSoft',
    description: 'Dicas, novidades e tendências para gestão de barbearias',
    publisher: {
      '@type': 'Organization',
      name: 'BarberSoft'
    }
  };

  return (
    <InstitutionalLayout breadcrumbs={[{ label: 'Blog' }]}>
      <SEOHead
        title="Blog"
        description="Dicas de gestão, marketing digital, tendências de cortes e novidades sobre tecnologia para barbearias. Conteúdo exclusivo para donos de barbearias."
        canonical="/blog"
        schema={schema}
      />

      <article>
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Blog BarberSoft</h1>
          <p className="text-xl text-muted-foreground">
            Dicas, novidades e tendências para transformar sua barbearia em um negócio de sucesso.
          </p>
        </header>

        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge 
                key={category} 
                variant={category === 'Todos' ? 'default' : 'secondary'}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {blogPosts.map((post) => (
            <Card key={post.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="text-center bg-muted p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Quer receber conteúdo exclusivo?</h2>
          <p className="text-muted-foreground mb-6">
            Inscreva-se na nossa newsletter e receba dicas semanais para sua barbearia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Seu melhor e-mail"
              className="flex-1 px-4 py-2 rounded-lg border bg-background"
            />
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Inscrever
            </button>
          </div>
        </section>
      </article>
    </InstitutionalLayout>
  );
};

export default Blog;
