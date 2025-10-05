import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Package, DollarSign, Weight, Box, Pencil, Trash2 } from "lucide-react";
import { useApp, Order } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    client: "",
    supplier: "",
    description: "",
    weight: "",
    volume: "",
    value: "",
    items: "",
    status: "Оформление",
    tracking: "",
  });

  const { orders, clients, addOrder, updateOrder, deleteOrder } = useApp();
  const { toast } = useToast();

  // Load data from calculator if available
  useEffect(() => {
    const calculatorData = sessionStorage.getItem("calculatorData");
    if (calculatorData) {
      try {
        const data = JSON.parse(calculatorData);
        setFormData(prev => ({
          ...prev,
          weight: data.weight.toString(),
          volume: data.volume.toString(),
          value: data.value.toString(),
        }));
        sessionStorage.removeItem("calculatorData");
        setIsDialogOpen(true);
        toast({
          title: "Данные загружены",
          description: "Параметры из калькулятора применены к форме",
        });
      } catch (e) {
        console.error("Failed to parse calculator data", e);
      }
    }
  }, [toast]);

  const generateTrackingNumber = () => {
    return `CN${Math.floor(100000000 + Math.random() * 900000000)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.client || !formData.supplier || !formData.description ||
        !formData.weight || !formData.volume || !formData.value || !formData.items) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive",
      });
      return;
    }

    if (editingOrder) {
      updateOrder(editingOrder.id, {
        client: formData.client,
        supplier: formData.supplier,
        description: formData.description,
        weight: Number(formData.weight),
        volume: Number(formData.volume),
        value: Number(formData.value),
        items: Number(formData.items),
        status: formData.status,
      });
      toast({
        title: "Успешно!",
        description: `Заказ ${editingOrder.id} обновлен`,
      });
    } else {
      const newOrder = {
        client: formData.client,
        supplier: formData.supplier,
        description: formData.description,
        weight: Number(formData.weight),
        volume: Number(formData.volume),
        value: Number(formData.value),
        items: Number(formData.items),
        status: formData.status,
        tracking: generateTrackingNumber(),
      };

      addOrder(newOrder);
      toast({
        title: "Успешно!",
        description: `Заказ создан с трек-номером ${newOrder.tracking}`,
      });
    }

    // Reset form
    setFormData({
      client: "",
      supplier: "",
      description: "",
      weight: "",
      volume: "",
      value: "",
      items: "",
      status: "Оформление",
      tracking: "",
    });
    setEditingOrder(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      client: order.client,
      supplier: order.supplier,
      description: order.description,
      weight: order.weight.toString(),
      volume: order.volume.toString(),
      value: order.value.toString(),
      items: order.items.toString(),
      status: order.status,
      tracking: order.tracking,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    if (deletingOrder) {
      deleteOrder(deletingOrder.id);
      toast({
        title: "Удалено",
        description: `Заказ ${deletingOrder.id} удален`,
      });
      setDeletingOrder(null);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingOrder(null);
      setFormData({
        client: "",
        supplier: "",
        description: "",
        weight: "",
        volume: "",
        value: "",
        items: "",
        status: "Оформление",
        tracking: "",
      });
    }
  };


  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Доставлен":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "В пути":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "На складе":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Таможня":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "Оформление":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const totalStats = {
    activeOrders: orders.filter(o => o.status !== "Доставлен").length,
    totalWeight: orders.reduce((sum, o) => sum + o.weight, 0),
    totalValue: orders.reduce((sum, o) => sum + o.value, 0),
    totalVolume: orders.reduce((sum, o) => sum + o.volume, 0),
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Заказы из Китая</h1>
            <p className="text-muted-foreground mt-2">
              Управление заказами и отгрузками
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Создать заказ
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>{editingOrder ? "Редактировать заказ" : "Новый заказ"}</DialogTitle>
                  <DialogDescription>
                    {editingOrder ? "Обновите информацию о заказе" : "Создание новой заявки на доставку груза из Китая"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="client">Клиент</Label>
                    <Select value={formData.client} onValueChange={(value) => setFormData({ ...formData, client: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите клиента" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.name}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="supplier">Поставщик в Китае</Label>
                    <Input
                      id="supplier"
                      placeholder="Название компании"
                      value={formData.supplier}
                      onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Описание груза</Label>
                    <Textarea
                      id="description"
                      placeholder="Опишите содержимое заказа"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="weight">Вес (кг)</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="0"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="volume">Объем (м³)</Label>
                      <Input
                        id="volume"
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        value={formData.volume}
                        onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="items">Количество мест</Label>
                      <Input
                        id="items"
                        type="number"
                        placeholder="0"
                        value={formData.items}
                        onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="value">Стоимость (₽)</Label>
                      <Input
                        id="value"
                        type="number"
                        placeholder="0"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      />
                    </div>
                  </div>
                  {editingOrder && (
                    <div className="grid gap-2">
                      <Label htmlFor="status">Статус</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Оформление">Оформление</SelectItem>
                          <SelectItem value="В пути">В пути</SelectItem>
                          <SelectItem value="Таможня">Таможня</SelectItem>
                          <SelectItem value="На складе">На складе</SelectItem>
                          <SelectItem value="Доставлен">Доставлен</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button type="submit">{editingOrder ? "Обновить заказ" : "Создать заказ"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <AlertDialog open={!!deletingOrder} onOpenChange={(open) => !open && setDeletingOrder(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Удалить заказ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Вы уверены, что хотите удалить заказ "{deletingOrder?.id}"? Это действие нельзя отменить.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                  Удалить
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Search and Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="md:col-span-4">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Поиск по номеру, клиенту, описанию..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Активных</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.activeOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">заказов в работе</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Общий вес</CardTitle>
                <Weight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.totalWeight.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">кг в обработке</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Объем</CardTitle>
                <Box className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.totalVolume.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground mt-1">м³ груза</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Стоимость</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₽{(totalStats.totalValue / 1000).toFixed(0)}K</div>
              <p className="text-xs text-muted-foreground mt-1">общая стоимость</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Список заказов</CardTitle>
            <CardDescription>
              Все заказы на доставку грузов из Китая
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Номер</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Поставщик</TableHead>
                  <TableHead>Параметры</TableHead>
                  <TableHead>Стоимость</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-accent/50">
                    <TableCell className="font-mono font-semibold">
                      {order.id}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.date).toLocaleDateString('ru-RU')}
                    </TableCell>
                    <TableCell className="font-medium">{order.client}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{order.description}</div>
                        <div className="text-xs text-muted-foreground">
                          Трекинг: {order.tracking}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {order.supplier}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div>{order.weight} кг</div>
                        <div className="text-muted-foreground">{order.volume} м³</div>
                        <div className="text-muted-foreground">{order.items} мест</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ₽{order.value.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)} variant="outline">
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(order)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingOrder(order)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
