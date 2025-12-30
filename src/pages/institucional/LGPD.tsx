import { InstitutionalLayout } from '@/layouts/InstitutionalLayout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Eye, Trash2, Download, Edit, Ban, Share2, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const rights = [
  { icon: Eye, title: 'Acesso', description: 'Confirmar e acessar seus dados pessoais' },
  { icon: Edit, title: 'Correção', description: 'Corrigir dados incompletos ou incorretos' },
  { icon: Trash2, title: 'Eliminação', description: 'Excluir dados desnecessários ou excessivos' },
  { icon: Download, title: 'Portabilidade', description: 'Receber seus dados em formato estruturado' },
  { icon: Ban, title: 'Oposição', description: 'Se opor ao tratamento em certas situações' },
  { icon: Share2, title: 'Informação', description: 'Saber com quem seus dados são compartilhados' },
];

const LGPD = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Solicitação enviada! Responderemos em até 15 dias úteis.');
      setIsSubmitting(false);
    }, 1000);
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'LGPD BarberSoft',
    description: 'Portal de direitos do titular de dados conforme a Lei Geral de Proteção de Dados.'
  };

  return (
    <InstitutionalLayout breadcrumbs={[{ label: 'LGPD' }]}>
      <SEOHead
        title="Direitos LGPD"
        description="Conheça seus direitos como titular de dados conforme a LGPD. Faça solicitações de acesso, correção, exclusão e portabilidade de dados."
        canonical="/lgpd"
        schema={schema}
      />

      <article>
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Seus Direitos sob a LGPD</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A Lei Geral de Proteção de Dados (Lei 13.709/2018) garante direitos sobre 
            seus dados pessoais. Veja como exercê-los.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Direitos do Titular</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {rights.map((right, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <right.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">{right.title}</h3>
                  <p className="text-sm text-muted-foreground">{right.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">O que é a LGPD?</h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p>
                A Lei Geral de Proteção de Dados (LGPD) é a legislação brasileira que 
                regulamenta o tratamento de dados pessoais por empresas e organizações. 
                Ela entrou em vigor em setembro de 2020.
              </p>
              <p>
                A LGPD garante que você, como titular dos dados, tenha controle sobre 
                suas informações pessoais e saiba como elas são coletadas, usadas e 
                compartilhadas.
              </p>
              <p>
                O BarberSoft está em conformidade com a LGPD e implementa medidas 
                técnicas e organizacionais para proteger seus dados.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Solicitar Exercício de Direitos</h2>
          <Card>
            <CardHeader>
              <CardTitle>Formulário de Requisição</CardTitle>
              <CardDescription>
                Preencha o formulário abaixo para exercer seus direitos. Responderemos 
                em até 15 dias úteis conforme determina a lei.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input id="name" placeholder="Seu nome completo" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input id="cpf" placeholder="000.000.000-00" required />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" placeholder="(11) 99999-9999" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="right">Tipo de Solicitação *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o direito que deseja exercer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="access">Acesso aos meus dados</SelectItem>
                      <SelectItem value="correction">Correção de dados</SelectItem>
                      <SelectItem value="deletion">Eliminação de dados</SelectItem>
                      <SelectItem value="portability">Portabilidade de dados</SelectItem>
                      <SelectItem value="opposition">Oposição ao tratamento</SelectItem>
                      <SelectItem value="revocation">Revogação de consentimento</SelectItem>
                      <SelectItem value="information">Informação sobre compartilhamento</SelectItem>
                      <SelectItem value="other">Outra solicitação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="details">Detalhes da Solicitação *</Label>
                  <Textarea 
                    id="details" 
                    placeholder="Descreva sua solicitação em detalhes..."
                    rows={4}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Encarregado de Dados (DPO)</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="mb-4">
                O Encarregado de Proteção de Dados (DPO) é o responsável por atender 
                solicitações relacionadas à LGPD e garantir a conformidade da empresa.
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p><strong>Nome:</strong> Equipe de Privacidade BarberSoft</p>
                <p><strong>E-mail:</strong> dpo@barbersoft.com.br</p>
                <p><strong>Endereço:</strong> Av. Paulista, 1000 - São Paulo/SP</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <Card className="bg-muted">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Prazo de Resposta</h3>
                  <p className="text-sm text-muted-foreground">
                    Conforme a LGPD, responderemos sua solicitação em até 15 dias úteis. 
                    Para solicitações complexas, podemos solicitar prazo adicional.
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
                  <h3 className="font-semibold mb-2">Verificação de Identidade</h3>
                  <p className="text-sm text-muted-foreground">
                    Para proteger seus dados, podemos solicitar documentos para 
                    confirmar sua identidade antes de processar a solicitação.
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

export default LGPD;
