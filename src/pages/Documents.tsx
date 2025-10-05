import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  FileText,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function Documents() {
  const { documents, orders, addDocument, deleteDocument } = useApp();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    orderId: "",
    fileName: "",
  });

  // Static example documents merged with real ones
  const staticDocs = documents.length === 0 ? [
    {
      id: "DOC-001",
      name: "Инвойс ORD-001",
      type: "Инвойс",
      orderId: "ORD-001",
      client: "ООО Стройтех",
      uploadDate: "2024-03-10",
      status: "Готов",
      size: "245 KB",
    },
    {
      id: "DOC-002",
      name: "Упаковочный лист ORD-001",
      type: "Паковочный лист",
      orderId: "ORD-001",
      client: "ООО Стройтех",
      uploadDate: "2024-03-10",
      status: "Готов",
      size: "180 KB",
    },
    {
      id: "DOC-003",
      name: "ГТД ORD-001",
      type: "ГТД",
      orderId: "ORD-001",
      client: "ООО Стройтех",
      uploadDate: "2024-03-14",
      status: "На проверке",
      size: "320 KB",
    },
    {
      id: "DOC-004",
      name: "Сертификат соответствия ORD-002",
      type: "Сертификат",
      orderId: "ORD-002",
      client: "ИП Волков",
      uploadDate: "2024-03-08",
      status: "Готов",
      size: "512 KB",
    },
    {
      id: "DOC-005",
      name: "Договор поставки ORD-003",
      type: "Договор",
      orderId: "ORD-003",
      client: "ООО МегаТорг",
      uploadDate: "2024-03-05",
      status: "Требует подписи",
      size: "430 KB",
    },
    {
      id: "DOC-006",
      name: "Транспортная накладная ORD-003",
      type: "Накладная",
      orderId: "ORD-003",
      client: "ООО МегаТорг",
      uploadDate: "2024-03-14",
      status: "На проверке",
      size: "290 KB",
    },
  ] : [];

  const allDocuments = [...staticDocs, ...documents];

  const customsSteps = [
    {
      name: "Подготовка документов",
      status: "completed",
      description: "Сбор всех необходимых документов",
    },
    {
      name: "Подача декларации",
      status: "completed",
      description: "ГТД подана в таможенные органы",
    },
    {
      name: "Проверка документов",
      status: "in_progress",
      description: "Идет проверка таможенными службами",
    },
    {
      name: "Оплата пошлин",
      status: "pending",
      description: "Ожидает оплаты таможенных платежей",
    },
    {
      name: "Выпуск груза",
      status: "pending",
      description: "Получение разрешения на выпуск",
    },
  ];

  const handleSubmit = () => {
    if (!formData.type || !formData.orderId) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive",
      });
      return;
    }

    const order = orders.find(o => o.id === formData.orderId);
    if (!order) {
      toast({
        title: "Ошибка",
        description: "Заказ не найден",
        variant: "destructive",
      });
      return;
    }

    const typeNames: Record<string, string> = {
      invoice: "Инвойс",
      packing: "Упаковочный лист",
      certificate: "Сертификат",
      gtd: "ГТД",
      contract: "Договор",
      waybill: "Накладная",
    };

    addDocument({
      name: `${typeNames[formData.type]} ${formData.orderId}`,
      type: typeNames[formData.type],
      orderId: formData.orderId,
      client: order.client,
      status: "Готов",
      size: "0 KB",
    });

    toast({
      title: "Успешно!",
      description: `Документ "${typeNames[formData.type]}" добавлен`,
    });

    setFormData({ type: "", orderId: "", fileName: "" });
    setIsDialogOpen(false);
  };

  const filteredDocuments = allDocuments.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.client.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "ready" && doc.status === "Готов") ||
      (activeTab === "pending" && doc.status !== "Готов");

    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Готов":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "На проверке":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Требует подписи":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Документы и таможня</h1>
            <p className="text-muted-foreground mt-2">
              Управление документами и таможенным оформлением
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Загрузить документ
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Загрузка документа</DialogTitle>
                <DialogDescription>
                  Добавьте новый документ в систему
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="docType">Тип документа</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invoice">Инвойс</SelectItem>
                      <SelectItem value="packing">Упаковочный лист</SelectItem>
                      <SelectItem value="certificate">Сертификат</SelectItem>
                      <SelectItem value="gtd">ГТД</SelectItem>
                      <SelectItem value="contract">Договор</SelectItem>
                      <SelectItem value="waybill">Накладная</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="order">Заказ</Label>
                  <Select value={formData.orderId} onValueChange={(value) => setFormData({ ...formData, orderId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите заказ" />
                    </SelectTrigger>
                    <SelectContent>
                      {orders.map((order) => (
                        <SelectItem key={order.id} value={order.id}>
                          {order.id} - {order.client}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="file">Файл (опционально)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="file"
                      type="file"
                      onChange={(e) => setFormData({ ...formData, fileName: e.target.files?.[0]?.name || "" })}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    PDF, JPG, PNG до 10 МБ
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSubmit}>Загрузить</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Всего документов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allDocuments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Готовы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {allDocuments.filter((d) => d.status === "Готов").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">На проверке</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                {allDocuments.filter((d) => d.status === "На проверке").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Требуют действий</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {allDocuments.filter((d) => d.status === "Требует подписи").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Documents List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Документы</CardTitle>
              <CardDescription>
                Все документы по заказам и таможенному оформлению
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">Все</TabsTrigger>
                  <TabsTrigger value="ready">Готовые</TabsTrigger>
                  <TabsTrigger value="pending">В работе</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Поиск по документам..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Заказ</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium text-sm">{doc.name}</div>
                            <div className="text-xs text-muted-foreground">{doc.size}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{doc.type}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-mono">{doc.orderId}</div>
                          <div className="text-muted-foreground">{doc.client}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(doc.uploadDate).toLocaleDateString('ru-RU')}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(doc.status)} variant="outline">
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Customs Process */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Таможенное оформление</CardTitle>
              <CardDescription>Процесс для ORD-001</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customsSteps.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      {getStepIcon(step.status)}
                      {index < customsSteps.length - 1 && (
                        <div
                          className={`w-0.5 h-12 mt-2 ${
                            step.status === "completed"
                              ? "bg-green-500/20"
                              : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="font-medium text-sm">{step.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {step.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg border bg-muted/50">
                <h4 className="font-semibold text-sm mb-2">Расчет таможенных платежей</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Пошлина:</span>
                    <span>₽23,400</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">НДС:</span>
                    <span>₽31,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Сборы:</span>
                    <span>₽5,600</span>
                  </div>
                  <div className="pt-2 border-t flex justify-between font-semibold">
                    <span>Итого:</span>
                    <span>₽60,200</span>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-4" variant="outline">
                Оплатить пошлины
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
