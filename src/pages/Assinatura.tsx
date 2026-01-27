import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSuperAdmin } from "@/hooks/useSuperAdmin";
import { 
  Crown, 
  CreditCard, 
  Calendar, 
  ArrowUpCircle, 
  XCircle,
  CheckCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  Loader2,
  Zap,
  Building2,
  Infinity,
  Shield,
  Receipt,
  AlertCircle
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const planDetails = {
  inicial: {
    name: "Inicial",
    icon: Zap,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    features: ["1 Unidade", "5 Profissionais", "Agenda ilimitada", "Relatórios básicos"],
    monthlyPrice: 99,
    annualPrice: 79,
  },
  profissional: {
    name: "Profissional",
    icon: Crown,
    color: "text-gold",
    bgColor: "bg-gold/10",
    features: ["3 Unidades", "15 Profissionais", "WhatsApp integrado", "Jackson IA", "Marketing automation"],
    monthlyPrice: 199,
    annualPrice: 159,
  },
  franquias: {
    name: "Franquias",
    icon: Building2,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    features: ["Unidades ilimitadas", "Profissionais ilimitados", "Multi-loja", "API completa", "Suporte prioritário"],
    monthlyPrice: 499,
    annualPrice: 399,
  },
};

const getStatusBadge = (status: string | null, isSuperAdmin: boolean = false, isCancelling: boolean = false) => {
  if (isSuperAdmin) {
    return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Vitalício</Badge>;
  }
  if (isCancelling) {
    return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Cancelando</Badge>;
  }
  switch (status) {
    case "trial":
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Em Trial</Badge>;
    case "active":
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ativo</Badge>;
    case "cancelled":
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Cancelado</Badge>;
    case "overdue":
      return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Pagamento Pendente</Badge>;
    case "partner":
      return <Badge className="bg-gold/20 text-gold border-gold/30">Parceiro</Badge>;
    default:
      return <Badge variant="secondary">Sem plano</Badge>;
  }
};

export default function Assinatura() {
  const { 
    status, 
    isLoading, 
    isPortalLoading,
    openCustomerPortal, 
    startCheckout, 
    isTrialing, 
    isPartner, 
    daysRemaining,
    isCancelling,
    hasStripeCustomer
  } = useSubscription();
  const { isSuperAdmin, isLoading: isSuperAdminLoading } = useSuperAdmin();
  const { toast } = useToast();
  const [isUpgrading, setIsUpgrading] = useState<string | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const currentPlan = status?.plan_type ? planDetails[status.plan_type] : null;
  const PlanIcon = isSuperAdmin ? Shield : (currentPlan?.icon || Crown);

  const handleOpenPortal = async () => {
    const url = await openCustomerPortal();
    if (url) {
      toast({
        title: "Portal aberto",
        description: "Você foi redirecionado para o portal de gerenciamento.",
      });
    }
  };

  const handleCancelSubscription = async () => {
    const url = await openCustomerPortal();
    if (url) {
      toast({
        title: "Cancelamento",
        description: "No portal Stripe, clique em 'Cancelar plano' para confirmar o cancelamento.",
      });
    }
    setIsCancelDialogOpen(false);
  };

  const handleUpgrade = async (plan: string) => {
    setIsUpgrading(plan);
    await startCheckout(plan, "monthly");
    setIsUpgrading(null);
  };

  const trialProgress = isTrialing && daysRemaining !== null 
    ? ((7 - daysRemaining) / 7) * 100 
    : 0;

  // Format price display
  const getPriceDisplay = () => {
    if (status?.price_amount) {
      const interval = status.price_interval === "year" ? "/ano" : "/mês";
      return `R$ ${status.price_amount.toFixed(2).replace('.', ',')}${interval}`;
    }
    if (currentPlan) {
      return `R$ ${currentPlan.monthlyPrice}/mês`;
    }
    return null;
  };

  // Format next billing date
  const getNextBillingDate = () => {
    if (status?.subscription_end) {
      return format(new Date(status.subscription_end), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    }
    return null;
  };

  if (isLoading || isSuperAdminLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Minha Assinatura</h1>
          <p className="text-muted-foreground">Gerencie seu plano e informações de pagamento</p>
        </div>

        {/* Super Admin Lifetime Access */}
        {isSuperAdmin && (
          <Card className="border-purple-500/30 bg-purple-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-500/20">
                  <Infinity className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-400">Acesso Vitalício</h3>
                  <p className="text-sm text-muted-foreground">
                    Como Super Admin, você tem acesso ilimitado e vitalício a todas as funcionalidades da plataforma.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trial Alert */}
        {!isSuperAdmin && isTrialing && daysRemaining !== null && (
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-blue-500/20">
                  <Clock className="h-6 w-6 text-blue-400" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-semibold text-blue-400">Período de Avaliação</h3>
                    <p className="text-sm text-muted-foreground">
                      Você está aproveitando seu trial gratuito de 7 dias. 
                      {daysRemaining > 0 
                        ? ` Restam ${daysRemaining} dia${daysRemaining > 1 ? 's' : ''} para testar todas as funcionalidades.`
                        : " Seu trial expira hoje!"
                      }
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progresso do trial</span>
                      <span className="text-blue-400">{7 - (daysRemaining || 0)}/7 dias</span>
                    </div>
                    <Progress value={trialProgress} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cancelling Alert */}
        {!isSuperAdmin && isCancelling && status?.subscription_end && (
          <Card className="border-orange-500/30 bg-orange-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-orange-500/20">
                  <AlertCircle className="h-6 w-6 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-400">Assinatura Cancelada</h3>
                  <p className="text-sm text-muted-foreground">
                    Sua assinatura será encerrada em {getNextBillingDate()}. 
                    Você pode reativar a qualquer momento antes desta data.
                  </p>
                  <Button 
                    className="mt-3" 
                    variant="outline"
                    onClick={handleOpenPortal}
                    disabled={isPortalLoading}
                  >
                    {isPortalLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Reativar Assinatura
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Partner Status */}
        {!isSuperAdmin && isPartner && (
          <Card className="border-gold/30 bg-gold/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-gold/20">
                  <Crown className="h-6 w-6 text-gold" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gold">Parceiro BarberSoft</h3>
                    <p className="text-sm text-muted-foreground">
                      Você tem acesso especial como parceiro. Obrigado por fazer parte da nossa jornada!
                    </p>
                  </div>
                  
                  {status?.partner_ends_at && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-gold/10">
                      <Calendar className="h-4 w-4 text-gold" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gold">
                          Acesso válido até: {format(new Date(status.partner_ends_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                        {daysRemaining !== null && daysRemaining > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {daysRemaining} dia{daysRemaining > 1 ? 's' : ''} restante{daysRemaining > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Current Plan Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <PlanIcon className={`h-5 w-5 ${isSuperAdmin ? 'text-purple-500' : (currentPlan?.color || 'text-gold')}`} />
                  Plano Atual
                </CardTitle>
                {getStatusBadge(status?.plan_status, isSuperAdmin, isCancelling)}
              </div>
              <CardDescription>Detalhes da sua assinatura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isSuperAdmin ? (
                <>
                  <div className="p-4 rounded-lg bg-purple-500/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-purple-400">
                          Super Admin
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Acesso Vitalício
                        </p>
                      </div>
                      <Shield className="h-10 w-10 text-purple-400 opacity-50" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Recursos inclusos:</p>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Todas as funcionalidades
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Unidades ilimitadas
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Profissionais ilimitados
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Painel administrativo
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Sem cobrança
                      </li>
                    </ul>
                  </div>
                </>
              ) : status?.plan_status === "active" || isCancelling ? (
                <>
                  <div className={`p-4 rounded-lg ${currentPlan?.bgColor || 'bg-gold/10'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={`text-xl font-bold ${currentPlan?.color || 'text-gold'}`}>
                          {status?.product_name || currentPlan?.name || 'Plano Ativo'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {getPriceDisplay()}
                        </p>
                      </div>
                      {currentPlan && <currentPlan.icon className={`h-10 w-10 ${currentPlan.color} opacity-50`} />}
                    </div>
                  </div>

                  {/* Billing Info */}
                  {status?.subscription_end && (
                    <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {isCancelling ? 'Acesso até:' : 'Próxima cobrança:'}
                        </span>
                        <span className="font-medium">{getNextBillingDate()}</span>
                      </div>
                      {status?.price_amount && !isCancelling && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Valor:
                          </span>
                          <span className="font-medium">{getPriceDisplay()}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Recursos inclusos:</p>
                    <ul className="space-y-1">
                      {currentPlan?.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum plano ativo</p>
                  <p className="text-sm mt-2">Escolha um plano ao lado para começar.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing & Actions Card - Hidden for Super Admin */}
          {!isSuperAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Faturamento
                </CardTitle>
                <CardDescription>Gerencie pagamentos e faturas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Billing Management Buttons - Only show if has Stripe customer */}
                {hasStripeCustomer && (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                      onClick={handleOpenPortal}
                      disabled={isPortalLoading}
                    >
                      <span className="flex items-center gap-2">
                        {isPortalLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CreditCard className="h-4 w-4" />
                        )}
                        Gerenciar Método de Pagamento
                      </span>
                      <ExternalLink className="h-4 w-4" />
                    </Button>

                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                      onClick={handleOpenPortal}
                      disabled={isPortalLoading}
                    >
                      <span className="flex items-center gap-2">
                        {isPortalLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Receipt className="h-4 w-4" />
                        )}
                        Ver Histórico de Faturas
                      </span>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </>
                )}

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Ações da Assinatura</p>
                  
                  {/* Upgrade Button - for active subscriptions not on highest plan */}
                  {(status?.plan_status === "active" && status?.plan_type !== "franquias" && !isCancelling) && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start gap-2 text-green-500 hover:text-green-400 hover:bg-green-500/10">
                          <ArrowUpCircle className="h-4 w-4" />
                          Fazer Upgrade
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Fazer Upgrade de Plano</AlertDialogTitle>
                          <AlertDialogDescription>
                            Escolha o novo plano para fazer upgrade. Você será redirecionado ao portal de pagamento.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="grid gap-3 py-4">
                          {Object.entries(planDetails)
                            .filter(([key]) => {
                              const order = ["inicial", "profissional", "franquias"];
                              return order.indexOf(key) > order.indexOf(status?.plan_type || "");
                            })
                            .map(([key, plan]) => (
                              <Button
                                key={key}
                                variant="outline"
                                className="justify-between"
                                onClick={() => handleUpgrade(key)}
                                disabled={isUpgrading === key}
                              >
                                <span className="flex items-center gap-2">
                                  {isUpgrading === key ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <plan.icon className={`h-4 w-4 ${plan.color}`} />
                                  )}
                                  {plan.name}
                                </span>
                                <span className="text-muted-foreground">
                                  R$ {plan.monthlyPrice}/mês
                                </span>
                              </Button>
                            ))}
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  {/* Cancel Button - Visible for active subscriptions that are not already cancelling */}
                  {status?.plan_status === "active" && !isPartner && !isCancelling && (
                    <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start gap-2 text-red-500 hover:text-red-400 hover:bg-red-500/10">
                          <XCircle className="h-4 w-4" />
                          Cancelar Assinatura
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Cancelar Assinatura
                          </AlertDialogTitle>
                          <AlertDialogDescription className="space-y-3">
                            <p>
                              Tem certeza que deseja cancelar sua assinatura? Ao confirmar:
                            </p>
                            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                              <li>Você manterá acesso até o fim do período atual</li>
                              <li>Não haverá cobranças futuras após o período</li>
                              <li>Seus dados serão mantidos por 30 dias</li>
                              <li>Você pode reativar a qualquer momento</li>
                            </ul>
                            <p className="text-sm font-medium text-orange-400">
                              Você será redirecionado ao portal Stripe para confirmar o cancelamento.
                            </p>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Manter Assinatura</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleCancelSubscription}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            {isPortalLoading ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : null}
                            Confirmar Cancelamento
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  {/* Choose Plan Button - Only show here if there's no plan in the current plan card */}
                  {hasStripeCustomer && (status?.plan_status === "trial" || status?.plan_status === "cancelled") && (
                    <Button 
                      className="w-full justify-start gap-2"
                      onClick={() => window.location.href = "/escolher-plano"}
                    >
                      <CreditCard className="h-4 w-4" />
                      Escolher um Plano
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Money-back Guarantee */}
        <Card className="border-gold/20 bg-gradient-to-r from-gold/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gold/20">
                <CheckCircle className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h3 className="font-semibold">Garantia de 30 Dias</h3>
                <p className="text-sm text-muted-foreground">
                  Não está satisfeito? Entre em contato com nosso suporte em até 30 dias após a compra 
                  e devolvemos 100% do seu dinheiro. Sem perguntas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
