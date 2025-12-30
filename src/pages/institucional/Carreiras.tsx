import { InstitutionalLayout } from '@/layouts/InstitutionalLayout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, Heart, Rocket, Coffee, Laptop } from 'lucide-react';

const jobs = [
  {
    id: 1,
    title: 'Desenvolvedor Full Stack',
    department: 'Engenharia',
    location: 'Remoto',
    type: 'CLT',
    description: 'Buscamos um dev Full Stack para trabalhar com React, Node.js e Supabase.'
  },
  {
    id: 2,
    title: 'Customer Success',
    department: 'Sucesso do Cliente',
    location: 'Remoto',
    type: 'CLT',
    description: 'Ajude nossos clientes a extrair o máximo do BarberSoft.'
  },
  {
    id: 3,
    title: 'Designer de Produto',
    department: 'Design',
    location: 'Remoto',
    type: 'CLT',
    description: 'Crie experiências incríveis para milhares de usuários.'
  },
  {
    id: 4,
    title: 'Analista de Marketing Digital',
    department: 'Marketing',
    location: 'Remoto',
    type: 'CLT',
    description: 'Lidere nossas estratégias de aquisição e growth.'
  }
];

const benefits = [
  { icon: Laptop, title: 'Trabalho 100% Remoto', description: 'Trabalhe de onde quiser, do Brasil ou do mundo.' },
  { icon: Heart, title: 'Plano de Saúde', description: 'Cobertura completa para você e dependentes.' },
  { icon: Coffee, title: 'Flexibilidade', description: 'Horário flexível para equilibrar vida pessoal e trabalho.' },
  { icon: Rocket, title: 'Crescimento', description: 'Plano de carreira claro e investimento em desenvolvimento.' },
];

const Carreiras = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Carreiras BarberSoft',
    description: 'Trabalhe conosco e ajude a transformar a gestão de barbearias no Brasil.'
  };

  return (
    <InstitutionalLayout breadcrumbs={[{ label: 'Carreiras' }]}>
      <SEOHead
        title="Carreiras"
        description="Junte-se ao time BarberSoft! Vagas em tecnologia, marketing, design e sucesso do cliente. Trabalho remoto, benefícios incríveis e ambiente inovador."
        canonical="/carreiras"
        schema={schema}
      />

      <article>
        <header className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4">Venha fazer parte</Badge>
          <h1 className="text-4xl font-bold mb-4">Carreiras no BarberSoft</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Estamos construindo o futuro da gestão de barbearias. Quer fazer parte dessa jornada?
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Por que trabalhar conosco?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <benefit.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Vagas Abertas</h2>
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="mb-2">{job.title}</CardTitle>
                      <CardDescription>{job.description}</CardDescription>
                    </div>
                    <Button>Candidatar-se</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {job.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <Badge variant="outline">{job.type}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-muted p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Não encontrou sua vaga?</h2>
          <p className="text-muted-foreground mb-6">
            Envie seu currículo para nosso banco de talentos. Entramos em contato quando surgir uma oportunidade.
          </p>
          <Button variant="outline" size="lg">
            Enviar Currículo
          </Button>
        </section>
      </article>
    </InstitutionalLayout>
  );
};

export default Carreiras;
