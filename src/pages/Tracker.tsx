import { useState } from "react";
import { MapPin, Plane, Train, Ship, Clock, Package, Eye, Navigation, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface CargoItem {
  id: string;
  cargoNumber: string;
  trackNumber: string;
  transportType: "air" | "rail" | "sea";
  route: {
    from: string;
    to: string;
  };
  currentStage: string;
  progress: number;
  estimatedDate: string;
  linkedOrder: string;
  status: "in-transit" | "customs" | "delivered" | "delayed";
}

const mockCargos: CargoItem[] = [
  {
    id: "1",
    cargoNumber: "CG-2024-001",
    trackNumber: "1234567890",
    transportType: "air",
    route: {
      from: "Гуанчжоу",
      to: "Москва",
    },
    currentStage: "В полете",
    progress: 65,
    estimatedDate: "2024-12-15",
    linkedOrder: "#2024-1234",
    status: "in-transit",
  },
  {
    id: "2",
    cargoNumber: "CG-2024-002",
    trackNumber: "0987654321",
    transportType: "rail",
    route: {
      from: "Пекин",
      to: "Екатеринбург",
    },
    currentStage: "Таможенное оформление",
    progress: 80,
    estimatedDate: "2024-12-18",
    linkedOrder: "#2024-1235",
    status: "customs",
  },
  {
    id: "3",
    cargoNumber: "CG-2024-003",
    trackNumber: "5678901234",
    transportType: "sea",
    route: {
      from: "Шанхай",
      to: "Санкт-Петербург",
    },
    currentStage: "В порту назначения",
    progress: 95,
    estimatedDate: "2024-12-20",
    linkedOrder: "#2024-1236",
    status: "customs",
  },
];

const mockStages = [
  { name: "Забор груза", date: "2024-12-10", completed: true },
  { name: "Отправка", date: "2024-12-11", completed: true },
  { name: "В пути", date: "2024-12-12", completed: true },
  { name: "Таможня", date: "2024-12-15", completed: false, current: true },
  { name: "Доставка", date: "2024-12-16", completed: false },
];

export default function Tracker() {
  const [selectedCargo, setSelectedCargo] = useState<CargoItem>(mockCargos[0]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStage, setNewStage] = useState("");
  const [stages, setStages] = useState(mockStages);

  const getTransportIcon = (type: string) => {
    switch (type) {
      case "air":
        return <Plane className="h-4 w-4" />;
      case "rail":
        return <Train className="h-4 w-4" />;
      case "sea":
        return <Ship className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-transit":
        return "bg-info";
      case "customs":
        return "bg-warning";
      case "delivered":
        return "bg-success";
      case "delayed":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in-transit":
        return "В пути";
      case "customs":
        return "Таможня";
      case "delivered":
        return "Доставлен";
      case "delayed":
        return "Задержка";
      default:
        return "Неизвестно";
    }
  };

  const updateCargoStatus = async () => {
    setIsUpdatingStatus(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsUpdatingStatus(false);
    alert("Статус груза обновлен и клиент уведомлен!");
  };

  const addNewStage = () => {
    if (!newStage.trim()) return;
    
    const stage = {
      name: newStage,
      date: new Date().toISOString().split('T')[0],
      completed: false,
      current: false,
    };
    
    setStages([...stages, stage]);
    setNewStage("");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Трекер груза</h1>
        <p className="text-muted-foreground">Отслеживание грузов в реальном времени</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cargo List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Список грузов</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockCargos.map((cargo) => (
                <div
                  key={cargo.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-accent/50 ${
                    selectedCargo.id === cargo.id ? "bg-accent border-primary" : "border-border"
                  }`}
                  onClick={() => setSelectedCargo(cargo)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-muted">
                        {getTransportIcon(cargo.transportType)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{cargo.cargoNumber}</p>
                        <p className="text-xs text-muted-foreground">{cargo.trackNumber}</p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(cargo.status)} text-white text-xs`}>
                      {getStatusLabel(cargo.status)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Navigation className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {cargo.route.from} → {cargo.route.to}
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-muted-foreground">{cargo.currentStage}</span>
                        <span className="text-xs font-medium">{cargo.progress}%</span>
                      </div>
                      <Progress value={cargo.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Прогноз: {cargo.estimatedDate}</span>
                      </div>
                      <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                        {cargo.linkedOrder}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Cargo Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map Placeholder */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Карта маршрута</CardTitle>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Полный экран
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-lg font-medium text-muted-foreground">Интерактивная карта</p>
                  <p className="text-sm text-muted-foreground">
                    Маршрут: {selectedCargo.route.from} → {selectedCargo.route.to}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <div className="h-3 w-3 bg-success rounded-full"></div>
                    <span className="text-xs">Пройдено</span>
                    <div className="h-3 w-3 bg-primary rounded-full"></div>
                    <span className="text-xs">Текущее местоположение</span>
                    <div className="h-3 w-3 bg-muted rounded-full"></div>
                    <span className="text-xs">Предстоит</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cargo Info & Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cargo Information */}
            <Card>
              <CardHeader>
                <CardTitle>Информация о грузе</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Номер груза</p>
                    <p className="font-medium">{selectedCargo.cargoNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Трек-номер</p>
                    <p className="font-medium">{selectedCargo.trackNumber}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Тип перевозки</p>
                  <div className="flex items-center gap-2">
                    {getTransportIcon(selectedCargo.transportType)}
                    <span className="font-medium capitalize">
                      {selectedCargo.transportType === "air" && "Авиаперевозка"}
                      {selectedCargo.transportType === "rail" && "Железная дорога"}
                      {selectedCargo.transportType === "sea" && "Морская перевозка"}
                    </span>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Маршрут</p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{selectedCargo.route.from}</span>
                    <Navigation className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedCargo.route.to}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Текущий статус</p>
                  <Badge className={`${getStatusColor(selectedCargo.status)} text-white`}>
                    {selectedCargo.currentStage}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Связанная заявка</p>
                  <Button variant="link" className="h-auto p-0 font-medium">
                    {selectedCargo.linkedOrder}
                  </Button>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Прогнозируемая доставка</p>
                  <p className="font-medium">{selectedCargo.estimatedDate}</p>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>История перемещений</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stages.map((stage, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-3 w-3 rounded-full border-2 ${
                            stage.completed
                              ? "bg-success border-success"
                              : stage.current
                              ? "bg-primary border-primary"
                              : "bg-background border-muted"
                          }`}
                        />
                        {index < stages.length - 1 && (
                          <div
                            className={`w-0.5 h-8 ${
                              stage.completed ? "bg-success" : "bg-muted"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <p
                            className={`font-medium ${
                              stage.current ? "text-primary" : stage.completed ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {stage.name}
                          </p>
                          <span className="text-sm text-muted-foreground">
                            {stage.date}
                          </span>
                        </div>
                        {stage.current && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Текущий этап выполнения
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Input
                    placeholder="Название нового этапа"
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addNewStage()}
                  />
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={addNewStage}
                    disabled={!newStage.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить этап
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button 
                  variant="outline" 
                  className="h-auto py-3 flex flex-col gap-2"
                  onClick={updateCargoStatus}
                  disabled={isUpdatingStatus}
                >
                  <Package className="h-5 w-5" />
                  <span className="text-sm">
                    {isUpdatingStatus ? "Обновление..." : "Обновить статус"}
                  </span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col gap-2">
                  <MapPin className="h-5 w-5" />
                  <span className="text-sm">Уведомить клиента</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col gap-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm">Изменить прогноз</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col gap-2">
                  <Navigation className="h-5 w-5" />
                  <span className="text-sm">Просмотр маршрута</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}