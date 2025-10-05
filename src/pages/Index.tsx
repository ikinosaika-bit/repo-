import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Package, MapPin, FileText, Users, TrendingUp, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = {
    unreadMessages: 7,
    activeOrders: 12,
    inTransitCargo: 5,
    pendingDocuments: 3,
    totalRevenue: 2450000,
    monthlyGrowth: 12.5,
  };

  const recentActivity = [
    { type: "message", content: "Новое сообщение от ООО Торговый Дом", time: "2 мин назад", urgent: true },
    { type: "cargo", content: "Груз CG-2024-001 прошел таможню", time: "15 мин назад", urgent: false },
    { type: "order", content: "Создана заявка #2024-1237", time: "1 час назад", urgent: false },
    { type: "document", content: "Документ EST-2024-002 подтвержден", time: "2 часа назад", urgent: false },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            LogiFlow Dashboard
          </h1>
          <p className="text-muted-foreground">
            {currentTime.toLocaleDateString("ru-RU", { 
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })} • {currentTime.toLocaleTimeString("ru-RU")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Добро пожаловать!</p>
          <p className="font-semibold">Менеджер логистики</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Непрочитанные сообщения</p>
                <p className="text-2xl font-bold">{stats.unreadMessages}</p>
              </div>
              <div className="p-3 bg-client/20 rounded-full">
                <MessageSquare className="h-6 w-6 text-client" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Активные заявки</p>
                <p className="text-2xl font-bold">{stats.activeOrders}</p>
              </div>
              <div className="p-3 bg-supplier/20 rounded-full">
                <Package className="h-6 w-6 text-supplier" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Грузы в пути</p>
                <p className="text-2xl font-bold">{stats.inTransitCargo}</p>
              </div>
              <div className="p-3 bg-carrier/20 rounded-full">
                <MapPin className="h-6 w-6 text-carrier" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Документы на подпись</p>
                <p className="text-2xl font-bold">{stats.pendingDocuments}</p>
              </div>
              <div className="p-3 bg-warning/20 rounded-full">
                <FileText className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Последняя активность
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'message' ? 'bg-client/20' :
                    activity.type === 'cargo' ? 'bg-carrier/20' :
                    activity.type === 'order' ? 'bg-supplier/20' :
                    'bg-info/20'
                  }`}>
                    {activity.type === 'message' && <MessageSquare className="h-4 w-4 text-client" />}
                    {activity.type === 'cargo' && <MapPin className="h-4 w-4 text-carrier" />}
                    {activity.type === 'order' && <Package className="h-4 w-4 text-supplier" />}
                    {activity.type === 'document' && <FileText className="h-4 w-4 text-info" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{activity.content}</p>
                      {activity.urgent && (
                        <Badge className="bg-destructive text-destructive-foreground">
                          Срочно
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Revenue */}
        <div className="space-y-6">
          {/* Revenue Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Выручка за месяц
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-bold">
                    {stats.totalRevenue.toLocaleString()} ₽
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-success text-success-foreground">
                      +{stats.monthlyGrowth}%
                    </Badge>
                    <span className="text-sm text-muted-foreground">к прошлому месяцу</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Прогресс к цели</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>Быстрый переход</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/messages">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Сообщения
                  {stats.unreadMessages > 0 && (
                    <Badge className="ml-auto bg-client text-client-foreground">
                      {stats.unreadMessages}
                    </Badge>
                  )}
                </Button>
              </Link>

              <Link to="/orders">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  Заявки
                  <Badge variant="secondary" className="ml-auto">
                    {stats.activeOrders}
                  </Badge>
                </Button>
              </Link>

              <Link to="/tracker">
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="h-4 w-4 mr-2" />
                  Трекер груза
                  <Badge variant="secondary" className="ml-auto">
                    {stats.inTransitCargo}
                  </Badge>
                </Button>
              </Link>

              <Link to="/documents">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Документы
                  {stats.pendingDocuments > 0 && (
                    <Badge className="ml-auto bg-warning text-warning-foreground">
                      {stats.pendingDocuments}
                    </Badge>
                  )}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Urgent Alerts */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Требует внимания
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-background rounded-lg border border-destructive/20">
                <p className="text-sm font-medium">Груз CG-2024-002 задерживается</p>
                <p className="text-xs text-muted-foreground">Свяжитесь с перевозчиком</p>
              </div>
              <div className="p-3 bg-background rounded-lg border border-warning/20">
                <p className="text-sm font-medium">3 документа ожидают подписи</p>
                <p className="text-xs text-muted-foreground">Проверьте раздел документов</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
