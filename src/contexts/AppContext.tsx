import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Types
export interface Client {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  city: string;
  orders: number;
  status: string;
}

export interface Order {
  id: string;
  date: string;
  client: string;
  description: string;
  status: string;
  weight: number;
  volume: number;
  value: number;
  items: number;
  supplier: string;
  tracking: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  orderId: string;
  client: string;
  uploadDate: string;
  status: string;
  size: string;
}

interface AppContextType {
  clients: Client[];
  orders: Order[];
  documents: Document[];
  addClient: (client: Omit<Client, "id" | "orders">) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addOrder: (order: Omit<Order, "id" | "date">) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  addDocument: (doc: Omit<Document, "id" | "uploadDate">) => void;
  updateDocument: (id: string, doc: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// LocalStorage keys
const STORAGE_KEYS = {
  CLIENTS: "cargo-app-clients",
  ORDERS: "cargo-app-orders",
  DOCUMENTS: "cargo-app-documents",
};

// Initial data
const initialClients: Client[] = [
  {
    id: "1",
    name: "ООО Стройтех",
    contact: "Иванов Иван",
    phone: "+7 (495) 123-45-67",
    email: "ivanov@stroyteh.ru",
    city: "Москва",
    orders: 24,
    status: "Активный",
  },
  {
    id: "2",
    name: "ИП Волков",
    contact: "Волков Петр",
    phone: "+7 (812) 234-56-78",
    email: "volkov@mail.ru",
    city: "Санкт-Петербург",
    orders: 15,
    status: "Активный",
  },
  {
    id: "3",
    name: "ООО МегаТорг",
    contact: "Сидорова Анна",
    phone: "+7 (495) 345-67-89",
    email: "info@megatorg.ru",
    city: "Москва",
    orders: 42,
    status: "VIP",
  },
];

const initialOrders: Order[] = [
  {
    id: "ORD-001",
    date: "2024-03-15",
    client: "ООО Стройтех",
    description: "Строительный инструмент",
    status: "В пути",
    weight: 450,
    volume: 2.5,
    value: 156000,
    items: 15,
    supplier: "Guangzhou Tools Ltd",
    tracking: "CN123456789",
  },
  {
    id: "ORD-002",
    date: "2024-03-14",
    client: "ИП Волков",
    description: "Электроника",
    status: "На складе",
    weight: 120,
    volume: 0.8,
    value: 89000,
    items: 45,
    supplier: "Shenzhen Electronics Co",
    tracking: "CN987654321",
  },
];

const initialDocuments: Document[] = [
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
];

export function AppProvider({ children }: { children: ReactNode }) {
  // Load from localStorage or use initial data
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [documents, setDocuments] = useState<Document[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    return saved ? JSON.parse(saved) : initialDocuments;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  }, [documents]);

  const addClient = (clientData: Omit<Client, "id" | "orders">) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      orders: 0,
    };
    setClients([...clients, newClient]);
  };

  const updateClient = (id: string, clientData: Partial<Client>) => {
    setClients(clients.map(c => c.id === id ? { ...c, ...clientData } : c));
  };

  const deleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
  };

  const addOrder = (orderData: Omit<Order, "id" | "date">) => {
    const orderCount = orders.length + 1;
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${String(orderCount).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
    };
    setOrders([...orders, newOrder]);

    // Update client order count
    const client = clients.find(c => c.name === orderData.client);
    if (client) {
      updateClient(client.id, { orders: client.orders + 1 });
    }
  };

  const updateOrder = (id: string, orderData: Partial<Order>) => {
    setOrders(orders.map(o => o.id === id ? { ...o, ...orderData } : o));
  };

  const deleteOrder = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  const addDocument = (docData: Omit<Document, "id" | "uploadDate">) => {
    const docCount = documents.length + 1;
    const newDoc: Document = {
      ...docData,
      id: `DOC-${String(docCount).padStart(3, "0")}`,
      uploadDate: new Date().toISOString().split("T")[0],
    };
    setDocuments([...documents, newDoc]);
  };

  const updateDocument = (id: string, docData: Partial<Document>) => {
    setDocuments(documents.map(d => d.id === id ? { ...d, ...docData } : d));
  };

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        clients,
        orders,
        documents,
        addClient,
        updateClient,
        deleteClient,
        addOrder,
        updateOrder,
        deleteOrder,
        addDocument,
        updateDocument,
        deleteDocument,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
