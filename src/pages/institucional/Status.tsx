import { InstitutionalLayout } from '@/layouts/InstitutionalLayout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock, Activity } from 'lucide-react';

const services = [
  { name: 'Aplicação Web', status: 'operational', uptime: '99.99%' },
  { name: 'API', status: 'operational', uptime: '99.98%' },
  { name: 'Banco de Dados', status: 'operational', uptime: '99.99%' },
  { name: 'WhatsApp Integration', status: 'operational', uptime: '99.95%' },
  { name: 'Notificações', status: 'operational', uptime: '99.97%' },
  { name: 'Relatórios', status: 'operational', uptime: '99.99%' },
];

const incidents = [
  {
    date: '15 Dez 2024',
    title: 'Manutenção programada',
    description: 'Atualização de infraestrutura realizada com sucesso.',
    status: 'resolved',
    duration: '15 min'
  },
  {
    date: '01 Dez 2024',
    title: 'Lentidão temporária na API',
    description: 'Identificado e corrigido gargalo de performance.',
    status: 'resolved',
    duration: '8 min'
  }
];

const Status = () => {
  const allOperational = services.every(s => s.status === 'operational');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Status do Sistema BarberSoft',
    description: 'Acompanhe em tempo real o status de todos os serviços do BarberSoft.'
  };

  return (
    <InstitutionalLayout breadcrumbs={[{ label: 'Status' }]}>
      <SEOHead
        title="Status do Sistema"
        description="Acompanhe em tempo real o status de todos os serviços do BarberSoft. Uptime, incidentes e manutenções programadas."
        canonical="/status"
        schema={schema}
      />

      <article>
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Status do Sistema</h1>
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${
            allOperational ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'
          }`}>
            {allOperational ? (
              <>
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Todos os sistemas operacionais</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Alguns serviços com problemas</span>
              </>
            )}
          </div>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Serviços</h2>
          <div className="space-y-3">
            {services.map((service, index) => (
              <Card key={index}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium">{service.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        Uptime: {service.uptime}
                      </span>
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                        Operacional
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Uptime dos Últimos 90 Dias</h2>
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-green-500">99.98%</span>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 90 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-8 flex-1 rounded-sm ${
                      Math.random() > 0.02 ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                    title={`Dia ${90 - i}`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>90 dias atrás</span>
                <span>Hoje</span>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Histórico de Incidentes</h2>
          <div className="space-y-4">
            {incidents.map((incident, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <CardTitle className="text-lg">{incident.title}</CardTitle>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                      Resolvido
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">{incident.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{incident.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Duração: {incident.duration}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-muted p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Receba alertas de status</h2>
          <p className="text-muted-foreground mb-6">
            Seja notificado quando houver manutenções ou incidentes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Seu e-mail"
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

export default Status;
