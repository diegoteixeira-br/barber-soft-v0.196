import { InstitutionalLayout } from '@/layouts/InstitutionalLayout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Zap, Shield, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const API = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'API BarberSoft',
    description: 'Documentação da API RESTful do BarberSoft para integração com sistemas externos.',
    provider: {
      '@type': 'Organization',
      name: 'BarberSoft'
    }
  };

  return (
    <InstitutionalLayout breadcrumbs={[{ label: 'API' }]}>
      <SEOHead
        title="API para Desenvolvedores"
        description="Integre seu sistema com a API RESTful do BarberSoft. Documentação completa, endpoints, autenticação e exemplos de código para desenvolvedores."
        canonical="/api"
        schema={schema}
      />

      <article>
        <header className="mb-12">
          <Badge variant="secondary" className="mb-4">Desenvolvedores</Badge>
          <h1 className="text-4xl font-bold mb-4">API BarberSoft</h1>
          <p className="text-xl text-muted-foreground">
            Integre seu sistema com nossa API RESTful. Acesse agendamentos, clientes, serviços e muito mais.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Alta Performance</CardTitle>
              <CardDescription>
                Endpoints otimizados com resposta média de 50ms
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Autenticação OAuth 2.0 e criptografia TLS 1.3
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Code className="h-8 w-8 text-primary mb-2" />
              <CardTitle>SDKs Oficiais</CardTitle>
              <CardDescription>
                Bibliotecas para JavaScript, Python e PHP
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Documentação Completa</CardTitle>
              <CardDescription>
                Guias, tutoriais e exemplos de código
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Endpoints Principais</h2>
          <div className="space-y-4">
            {[
              { method: 'GET', path: '/api/v1/appointments', desc: 'Lista todos os agendamentos' },
              { method: 'POST', path: '/api/v1/appointments', desc: 'Cria um novo agendamento' },
              { method: 'GET', path: '/api/v1/clients', desc: 'Lista todos os clientes' },
              { method: 'GET', path: '/api/v1/services', desc: 'Lista todos os serviços' },
              { method: 'GET', path: '/api/v1/barbers', desc: 'Lista todos os profissionais' },
            ].map((endpoint, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                  {endpoint.method}
                </Badge>
                <code className="font-mono text-sm flex-1">{endpoint.path}</code>
                <span className="text-muted-foreground text-sm">{endpoint.desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Exemplo de Código</h2>
          <Card>
            <CardContent className="p-6">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`// Exemplo: Listar agendamentos do dia
const response = await fetch('https://api.barbersoft.com.br/v1/appointments', {
  headers: {
    'Authorization': 'Bearer SEU_TOKEN',
    'Content-Type': 'application/json'
  }
});

const appointments = await response.json();
console.log(appointments);`}
              </pre>
            </CardContent>
          </Card>
        </section>

        <section className="text-center bg-muted p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-muted-foreground mb-6">
            Crie sua conta e obtenha suas credenciais de API gratuitamente.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/auth">Criar Conta Grátis</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/documentacao">Ver Documentação</Link>
            </Button>
          </div>
        </section>
      </article>
    </InstitutionalLayout>
  );
};

export default API;
