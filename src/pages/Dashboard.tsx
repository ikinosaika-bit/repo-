import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Package, Users, DollarSign, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { clients, orders } = useApp();
  const navigate = useNavigate();

  // Calculate statistics from real data
  const activeOrders = orders.filter(o => o.status !== "Доставлен").length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.value, 0);
  const inTransit = orders.filter(o => o.status === "В пути").length;

  const stats = [
    {
      title: "Активные заказы",
      value: activeOrders.toString(),
      change: "+12%",
      trend: "up",
      icon: Package,
      color: "text-blue-500",
    },
    {
      title: "Всего клиентов",
      value: clients.length.toString(),
      change: "+8%",
      trend: "up",
      icon: Users,
      color: "text-green-500",
    },
    {
      title: "Доход месяц",
      value: totalRevenue > 0 ? `₽${(totalRevenue / 1000).toFixed(0)}K` : "₽0",
      change: "+23%",
      trend: "up",
      icon: DollarSign,
      color: "text-yellow-500",
    },
    {
      title: "В пути",
      value: inTransit.toString(),
      change: "-5%",
      trend: "down",
      icon: Clock,
      color: "text-purple-500",
    },
  ];

  // Get last 4 orders
  const recentOrders = orders.slice(-4).reverse().map(order => ({
    id: order.id,
    client: order.client,
    status: order.status,
    progress: order.status === "Доставлен" ? 100 :
              order.status === "В пути" ? 75 :
              order.status === "Таможня" ? 60 :
              order.status === "На складе" ? 50 : 25,
    eta: order.status === "Доставлен" ? "Завершен" : "5 дней"
  }));

  const statusColors: Record<string, string> = {
    "В пути": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "На складе": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    "Таможня": "bg-purple-500/10 text-purple-500 border-purple-500/20",
    "Оформление": "bg-orange-500/10 text-orange-500 border-orange-500/20",
    "Доставлен": "bg-green-500/10 text-green-500 border-green-500/20",
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Добро пожаловать!</h1>
          <p className="text-muted-foreground mt-2">
            Обзор вашего карго бизнеса за сегодня
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                    {stat.change}
                  </span>
                  <span className="ml-1">от прошлого месяца</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Последние заказы</CardTitle>
            <CardDescription>
              Актуальный статус ваших активных заказов
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => navigate('/orders')}
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold">
                          {order.id}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm">{order.client}</span>
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium border ${
                            statusColors[order.status] || statusColors["Оформление"]
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 max-w-xs">
                          <Progress value={order.progress} className="h-2" />
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          ETA: {order.eta}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Пока нет заказов. Создайте первый заказ!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate('/orders')}
          >
            <CardHeader>
              <CardTitle className="text-base">Новый заказ</CardTitle>
              <CardDescription>
                Создать заявку на доставку из Китая
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate('/clients')}
          >
            <CardHeader>
              <CardTitle className="text-base">Добавить клиента</CardTitle>
              <CardDescription>
                Зарегистрировать нового клиента
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate('/calculator')}
          >
            <CardHeader>
              <CardTitle className="text-base">Калькулятор</CardTitle>
              <CardDescription>
                Рассчитать стоимость доставки
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
