import { useState } from "react";
import { Search, Plus, Phone, FileText, MoreVertical, Send, Paperclip, Smile, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const mockDialogs = [
  {
    id: 1,
    name: "ООО Торговый Дом",
    type: "client",
    lastMessage: "Когда будет готов груз?",
    time: "14:30",
    unread: 3,
    online: true,
    activeProjects: 2,
  },
  {
    id: 2,
    name: "Гуанчжоу Поставки",
    type: "supplier",
    lastMessage: "Товар готов к отправке",
    time: "13:45",
    unread: 0,
    online: false,
    activeProjects: 1,
  },
  {
    id: 3,
    name: "Логистик Экспресс",
    type: "carrier",
    lastMessage: "Груз прибыл на склад",
    time: "12:20",
    unread: 1,
    online: true,
    activeProjects: 3,
  },
];

const mockMessages = [
  {
    id: 1,
    sender: "other",
    content: "Добрый день! Хотел бы уточнить статус заявки #2024-1234",
    time: "14:25",
    type: "text",
  },
  {
    id: 2,
    sender: "me",
    content: "Здравствуйте! Заявка находится в обработке, ожидаем подтверждение от поставщика",
    time: "14:27",
    type: "text",
  },
  {
    id: 3,
    sender: "other",
    content: "Когда примерно будет готов груз?",
    time: "14:30",
    type: "text",
  },
];

export default function Messages() {
  const [selectedDialog, setSelectedDialog] = useState(mockDialogs[0]);
  const [filter, setFilter] = useState("all");
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [isTyping, setIsTyping] = useState(false);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "client":
        return "bg-client text-client-foreground";
      case "supplier":
        return "bg-supplier text-supplier-foreground";
      case "carrier":
        return "bg-carrier text-carrier-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "client":
        return "Клиент";
      case "supplier":
        return "Поставщик";
      case "carrier":
        return "Перевозчик";
      default:
        return "Контакт";
    }
  };

  const filteredDialogs = mockDialogs.filter(dialog => {
    const matchesSearch = dialog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dialog.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || 
                         filter === dialog.type || 
                         (filter === "unread" && dialog.unread > 0);
    return matchesSearch && matchesFilter;
  });

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now(),
      sender: "me" as const,
      content: newMessage,
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      type: "text" as const,
    };

    setMessages([...messages, message]);
    setNewMessage("");
    
    // Simulate typing indicator and response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response = {
        id: Date.now() + 1,
        sender: "other" as const,
        content: "Спасибо за сообщение! Мы рассмотрим ваш запрос.",
        time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
        type: "text" as const,
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  return (
    <div className="h-full flex">
      {/* Left Panel - Dialogs List */}
      <div className="w-80 border-r border-border flex flex-col bg-card/30">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Сообщения</h2>
            <Badge variant="secondary" className="bg-client text-client-foreground">
              {mockDialogs.reduce((sum, dialog) => sum + dialog.unread, 0)}
            </Badge>
          </div>
          
          {/* Filters */}
          <div className="flex gap-2 mb-3">
            {[
              { id: "all", label: "Все" },
              { id: "client", label: "Клиенты" },
              { id: "supplier", label: "Поставщики" },
              { id: "unread", label: "Непрочитанные" },
            ].map((filterItem) => (
              <Button
                key={filterItem.id}
                variant={filter === filterItem.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(filterItem.id)}
                className="text-xs"
              >
                {filterItem.label}
              </Button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Поиск контактов..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* New Message Button */}
          <Button className="w-full mt-3 bg-gradient-primary" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Новое сообщение
          </Button>
        </div>

        {/* Dialogs List */}
        <div className="flex-1 overflow-y-auto">
          {filteredDialogs.map((dialog) => (
            <div
              key={dialog.id}
              className={cn(
                "p-4 border-b border-border cursor-pointer hover:bg-accent/50 transition-colors",
                selectedDialog.id === dialog.id && "bg-accent"
              )}
              onClick={() => setSelectedDialog(dialog)}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" />
                    <AvatarFallback className={getTypeColor(dialog.type)}>
                      {dialog.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {dialog.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-success rounded-full border-2 border-background" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm truncate">{dialog.name}</h3>
                    <span className="text-xs text-muted-foreground">{dialog.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={cn("text-xs", getTypeColor(dialog.type))}>
                      {getTypeLabel(dialog.type)}
                    </Badge>
                    {dialog.activeProjects > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {dialog.activeProjects} проектов
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">
                      {dialog.lastMessage}
                    </p>
                    {dialog.unread > 0 && (
                      <Badge className="bg-client text-client-foreground text-xs ml-2">
                        {dialog.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Panel - Chat */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-card/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" />
                <AvatarFallback className={getTypeColor(selectedDialog.type)}>
                  {selectedDialog.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{selectedDialog.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedDialog.online ? "В сети" : "Не в сети"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Позвонить
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Создать заявку
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === "me" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-md p-3 rounded-lg",
                  message.sender === "me"
                    ? "bg-client text-client-foreground"
                    : "bg-card border border-border"
                )}
              >
                <p className="text-sm">{message.content}</p>
                <p className={cn(
                  "text-xs mt-1",
                  message.sender === "me" 
                    ? "text-client-foreground/70" 
                    : "text-muted-foreground"
                )}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-md p-3 rounded-lg bg-card border border-border">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-card/30">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Textarea
                placeholder="Введите сообщение..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="min-h-[44px] max-h-32 resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Image className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Smile className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                className="bg-gradient-primary"
                onClick={sendMessage}
                disabled={!newMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Contact Info */}
      <div className="w-80 border-l border-border bg-card/30 p-4 space-y-6">
        {/* Contact Info */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{getTypeLabel(selectedDialog.type)}</h3>
              <Button variant="ghost" size="sm">
                Редактировать
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium">{selectedDialog.name}</p>
              <p className="text-sm text-muted-foreground">ООО "Торговый Дом"</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm"><strong>Телефон:</strong> +7 (495) 123-45-67</p>
              <p className="text-sm"><strong>Email:</strong> info@trade-company.ru</p>
              <p className="text-sm"><strong>WeChat:</strong> trade_company_cn</p>
            </div>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Активные заявки</h3>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-accent/50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">#2024-1234</span>
                  <Badge variant="secondary">В работе</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Электроника из Шэньчжэня</p>
              </div>
              
              <div className="p-3 bg-accent/50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">#2024-1235</span>
                  <Badge className="bg-warning text-warning-foreground">Ожидание</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Текстиль из Гуанчжоу</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cargo Tracker */}
        <Card>
          <CardHeader className="pb-3">
            <h3 className="font-semibold">Трекер груза</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Текущий этап:</span>
                <Badge className="bg-info text-info-foreground">Таможня</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Прогноз доставки: 15.12.2024
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Отправить статус груза
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <h3 className="font-semibold">Быстрые действия</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                Написать клиенту
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Редактировать заявку
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Создать просчет
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Отправить документ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}