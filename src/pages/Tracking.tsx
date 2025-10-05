import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, MapPin, CheckCircle2, Clock, Package, Plane, Ship, Truck } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

export default function Tracking() {
  const { orders } = useApp();
  const { toast } = useToast();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(orders.length > 0 ? orders[0].tracking : null);

  // Generate timeline based on order status
  const generateTimeline = (order: typeof orders[0]) => {
    const orderDate = new Date(order.date);
    const statuses = ["Оформление", "В пути", "Таможня", "На складе", "Доставлен"];
    const currentStatusIndex = statuses.indexOf(order.status);

    return statuses.map((status, index) => {
      const eventDate = new Date(orderDate);
      eventDate.setDate(eventDate.getDate() + index * 5);

      return {
        date: eventDate.toISOString().split("T")[0],
        location: index === 0 ? "Китай" : index === 1 ? "В пути" : index === 2 ? "Таможня РФ" : index === 3 ? "Склад в России" : "Доставлено клиенту",
        status: status,
        completed: index <= currentStatusIndex,
      };
    });
  };

  const shipments = orders.map(order => {
    const statusProgress: Record<string, number> = {
      "Оформление": 20,
      "В пути": 50,
      "Таможня": 75,
      "На складе": 90,
      "Доставлен": 100,
    };

    const deliveryMethods = ["Авиа", "ЖД", "Море", "Экспресс"];
    const method = deliveryMethods[Math.floor(Math.random() * deliveryMethods.length)];

    const estimatedDate = new Date(order.date);
    estimatedDate.setDate(estimatedDate.getDate() + (method === "Авиа" ? 7 : method === "ЖД" ? 20 : 35));

    return {
      id: order.tracking,
      orderId: order.id,
      client: order.client,
      status: order.status,
      progress: statusProgress[order.status] || 20,
      currentLocation: order.status === "Доставлен" ? "У клиента" : order.status === "На складе" ? "Склад в России" : order.status === "Таможня" ? "Таможня РФ" : "В пути из Китая",
      estimatedDelivery: estimatedDate.toISOString().split("T")[0],
      method: method,
      timeline: generateTimeline(order),
    };
  });

  const currentShipment = shipments.find(s => s.id === selectedOrder) || shipments[0];

  const handleSearch = () => {
    const found = shipments.find(s => s.id.toLowerCase().includes(trackingNumber.toLowerCase()));
    if (found) {
      setSelectedOrder(found.id);
      toast({
        title: "Груз найден",
        description: `Заказ ${found.orderId} - ${found.client}`,
      });
    } else {
      toast({
        title: "Не найдено",
        description: "Груз с таким трек-номером не найден",
        variant: "destructive",
      });
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "Авиа":
        return <Plane className="h-4 w-4" />;
      case "Море":
        return <Ship className="h-4 w-4" />;
      case "ЖД":
        return <Truck className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "На складе":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "В пути":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Таможня":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Трекинг грузов</h1>
          <p className="text-muted-foreground mt-2">
            Отслеживание местоположения и статуса ваших грузов
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Введите трек-номер для отслеживания..."
                  className="pl-10"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch}>Отследить</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Shipments List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Активные отправления</CardTitle>
              <CardDescription>Выберите для детального просмотра</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {shipments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Нет активных отправлений</p>
                </div>
              ) : (
                shipments.map((shipment) => (
                <div
                  key={shipment.id}
                  onClick={() => setSelectedOrder(shipment.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedOrder === shipment.id
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50 hover:bg-accent/50"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-semibold">{shipment.id}</span>
                      <Badge className={getStatusColor(shipment.status)} variant="outline">
                        {shipment.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {shipment.orderId} • {shipment.client}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {getMethodIcon(shipment.method)}
                      <span>{shipment.method}</span>
                    </div>
                    <Progress value={shipment.progress} className="h-1.5" />
                  </div>
                </div>
              ))
              )}
            </CardContent>
          </Card>

          {/* Tracking Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Детали отправления</CardTitle>
                  <CardDescription className="mt-1">
                    Трек-номер: {currentShipment.id}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(currentShipment.status)} variant="outline">
                  {currentShipment.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary Info */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-start gap-3 p-4 rounded-lg border">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Текущая локация</div>
                    <div className="font-medium mt-1">{currentShipment.currentLocation}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Ожидаемая доставка</div>
                    <div className="font-medium mt-1">
                      {new Date(currentShipment.estimatedDelivery).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border">
                  {getMethodIcon(currentShipment.method)}
                  <div className="mt-0.5">
                    <div className="text-sm text-muted-foreground">Способ доставки</div>
                    <div className="font-medium mt-1">{currentShipment.method}</div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Прогресс доставки</span>
                  <span className="font-semibold">{currentShipment.progress}%</span>
                </div>
                <Progress value={currentShipment.progress} className="h-2" />
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h3 className="font-semibold">История перемещения</h3>
                <div className="space-y-4">
                  {currentShipment.timeline.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`rounded-full p-2 ${
                            event.completed
                              ? "bg-green-500/10"
                              : "bg-muted"
                          }`}
                        >
                          {event.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        {index < currentShipment.timeline.length - 1 && (
                          <div
                            className={`w-0.5 h-12 ${
                              event.completed ? "bg-green-500/20" : "bg-muted"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{event.status}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {event.location}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString('ru-RU')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="pt-4 border-t">
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Номер заказа:</span>
                    <span className="font-medium">{currentShipment.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Клиент:</span>
                    <span className="font-medium">{currentShipment.client}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
