import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calculator as CalcIcon, Package, DollarSign, Clock, TrendingUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Calculator() {
  const { clients } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [weight, setWeight] = useState("");
  const [volume, setVolume] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("air");
  const [cargoType, setCargoType] = useState("general");
  const [calculated, setCalculated] = useState(false);

  const deliveryMethods = {
    air: { name: "Авиа", pricePerKg: 8.5, days: "5-7", icon: "✈️" },
    railway: { name: "ЖД", pricePerKg: 4.2, days: "15-20", icon: "🚂" },
    sea: { name: "Море", pricePerKg: 2.1, days: "30-40", icon: "🚢" },
    express: { name: "Экспресс", pricePerKg: 15.0, days: "3-5", icon: "⚡" },
  };

  const cargoTypes = {
    general: { name: "Обычный груз", multiplier: 1.0 },
    fragile: { name: "Хрупкий", multiplier: 1.3 },
    valuable: { name: "Ценный", multiplier: 1.5 },
    dangerous: { name: "Опасный", multiplier: 1.8 },
  };

  const calculateCost = () => {
    const w = parseFloat(weight) || 0;
    const v = parseFloat(volume) || 0;

    // Объемный вес: объем (м³) * 167
    const volumeWeight = v * 167;

    // Используем больший вес из фактического и объемного
    const chargeableWeight = Math.max(w, volumeWeight);

    const method = deliveryMethods[deliveryMethod as keyof typeof deliveryMethods];
    const type = cargoTypes[cargoType as keyof typeof cargoTypes];

    const baseCost = chargeableWeight * method.pricePerKg * type.multiplier;
    const customsFee = baseCost * 0.15; // 15% таможенные сборы
    const insurance = baseCost * 0.03; // 3% страховка
    const serviceFee = 5000; // Фиксированная комиссия за сервис

    return {
      chargeableWeight: chargeableWeight.toFixed(2),
      baseCost: Math.round(baseCost),
      customsFee: Math.round(customsFee),
      insurance: Math.round(insurance),
      serviceFee,
      totalCost: Math.round(baseCost + customsFee + insurance + serviceFee),
      pricePerKg: method.pricePerKg,
      deliveryDays: method.days,
      methodName: method.name,
    };
  };

  const result = calculated ? calculateCost() : null;

  const handleCalculate = () => {
    if (weight && volume) {
      setCalculated(true);
    }
  };

  const handleCreateOrder = () => {
    if (!calculated || !result) {
      toast({
        title: "Ошибка",
        description: "Сначала рассчитайте стоимость доставки",
        variant: "destructive",
      });
      return;
    }

    if (clients.length === 0) {
      toast({
        title: "Добавьте клиента",
        description: "Сначала создайте хотя бы одного клиента",
        variant: "destructive",
      });
      navigate("/clients");
      return;
    }

    // Store calculation data in sessionStorage to pass to Orders page
    sessionStorage.setItem("calculatorData", JSON.stringify({
      weight: parseFloat(weight),
      volume: parseFloat(volume),
      value: result.totalCost,
      deliveryMethod: result.methodName,
    }));

    toast({
      title: "Перенаправление",
      description: "Создайте заказ на основе расчета",
    });

    navigate("/orders");
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Калькулятор доставки</h1>
          <p className="text-muted-foreground mt-2">
            Рассчитайте стоимость доставки груза из Китая
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calculator Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Параметры груза</CardTitle>
              <CardDescription>
                Введите данные для расчета стоимости доставки
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Основные</TabsTrigger>
                  <TabsTrigger value="advanced">Дополнительно</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Вес груза (кг)</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="0"
                        value={weight}
                        onChange={(e) => {
                          setWeight(e.target.value);
                          setCalculated(false);
                        }}
                      />
                      <p className="text-xs text-muted-foreground">
                        Фактический вес вашего груза
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="volume">Объем (м³)</Label>
                      <Input
                        id="volume"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={volume}
                        onChange={(e) => {
                          setVolume(e.target.value);
                          setCalculated(false);
                        }}
                      />
                      <p className="text-xs text-muted-foreground">
                        Длина × Ширина × Высота в метрах
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="method">Способ доставки</Label>
                    <Select
                      value={deliveryMethod}
                      onValueChange={(value) => {
                        setDeliveryMethod(value);
                        setCalculated(false);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(deliveryMethods).map(([key, method]) => (
                          <SelectItem key={key} value={key}>
                            <span className="flex items-center gap-2">
                              <span>{method.icon}</span>
                              <span>{method.name}</span>
                              <span className="text-muted-foreground">
                                ({method.days} дней)
                              </span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Тип груза</Label>
                    <Select
                      value={cargoType}
                      onValueChange={(value) => {
                        setCargoType(value);
                        setCalculated(false);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(cargoTypes).map(([key, type]) => (
                          <SelectItem key={key} value={key}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleCalculate} className="w-full gap-2" size="lg">
                    <CalcIcon className="h-4 w-4" />
                    Рассчитать стоимость
                  </Button>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4 mt-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="length">Длина (см)</Label>
                      <Input id="length" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="width">Ширина (см)</Label>
                      <Input id="width" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Высота (см)</Label>
                      <Input id="height" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="items">Количество мест</Label>
                      <Input id="items" type="number" placeholder="1" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Расчет стоимости</CardTitle>
              <CardDescription>
                {calculated ? "Итоговая стоимость доставки" : "Заполните форму"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {calculated && result ? (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Расчетный вес:</span>
                      <span className="font-medium">{result.chargeableWeight} кг</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Способ:</span>
                      <Badge variant="outline">{result.methodName}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Срок доставки:</span>
                      <span className="font-medium">{result.deliveryDays} дней</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Детализация:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Доставка</span>
                        <span>₽{result.baseCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Таможня (15%)</span>
                        <span>₽{result.customsFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Страховка (3%)</span>
                        <span>₽{result.insurance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Комиссия</span>
                        <span>₽{result.serviceFee.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Итого:</span>
                      <span className="text-2xl font-bold text-primary">
                        ₽{result.totalCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      Примерная стоимость. Окончательная цена может отличаться
                    </div>
                  </div>

                  <Button className="w-full" size="lg" onClick={handleCreateOrder}>
                    Создать заказ
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CalcIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Введите параметры груза для расчета стоимости
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Авиа</CardTitle>
                <span className="text-2xl">✈️</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-bold">₽8.5/кг</div>
                <p className="text-xs text-muted-foreground">5-7 дней доставки</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">ЖД</CardTitle>
                <span className="text-2xl">🚂</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-bold">₽4.2/кг</div>
                <p className="text-xs text-muted-foreground">15-20 дней доставки</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Море</CardTitle>
                <span className="text-2xl">🚢</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-bold">₽2.1/кг</div>
                <p className="text-xs text-muted-foreground">30-40 дней доставки</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Экспресс</CardTitle>
                <span className="text-2xl">⚡</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-bold">₽15/кг</div>
                <p className="text-xs text-muted-foreground">3-5 дней доставки</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
