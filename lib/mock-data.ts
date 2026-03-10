import { ChatConversation, ChatMessage, CustomerContext } from './types';
import { Product } from './types';
import { Customer } from './types';

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: "Ali Khan",
    phone: "+92 300 1234567",
    email: "ali.khan@example.com",
    totalOrders: 15,
    totalSpent: 450.50,
    lastOrderDate: "2023-10-25",
    status: 'ACTIVE',
    tags: ['VIP', 'Frequent'],
    joinedDate: "2023-01-15"
  },
  {
    id: 2,
    name: "Sara Ahmed",
    phone: "+92 321 9876543",
    totalOrders: 3,
    totalSpent: 85.00,
    lastOrderDate: "2023-10-20",
    status: 'ACTIVE',
    tags: ['New'],
    joinedDate: "2023-09-10"
  },
  {
    id: 3,
    name: "Spam User",
    phone: "+92 300 0000000",
    totalOrders: 0,
    totalSpent: 0,
    lastOrderDate: "-",
    status: 'BLOCKED',
    tags: ['Risk'],
    joinedDate: "2023-10-01"
  }
];

export const MOCK_INVENTORY: Product[] = [
  {
    id: 1,
    name: "Classic Smash Burger",
    category: "Burgers",
    price: 8.50,
    stock: 150,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=100&q=60",
    status: "ACTIVE",
    sales: 1240
  },
  {
    id: 2,
    name: "Spicy Zinger",
    category: "Burgers",
    price: 6.00,
    stock: 24,
    image: "https://images.unsplash.com/photo-1615557960916-5f4791effe9d?auto=format&fit=crop&w=100&q=60",
    status: "ACTIVE",
    sales: 850
  },
  {
    id: 3,
    name: "Coca Cola (Can)",
    category: "Drinks",
    price: 1.50,
    stock: 0, // Out of stock example
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=100&q=60",
    status: "DRAFT",
    sales: 5000
  },
  {
    id: 4,
    name: "Large Fries",
    category: "Sides",
    price: 3.50,
    stock: 500,
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=100&q=60",
    status: "ACTIVE",
    sales: 3200
  },
];


export const MOCK_CONVERSATIONS: ChatConversation[] = [
  { 
    id: 1, 
    name: "Ali Khan", 
    phone: "+92 300 1234567", 
    lastMessage: "Where is my order?", 
    time: "2m", 
    unread: 1, 
    status: 'AGENT_ACTIVE', 
    avatarColor: "bg-blue-100 text-blue-600"
  },
  { 
    id: 2, 
    name: "Sara Ahmed", 
    phone: "+92 321 9876543", 
    lastMessage: "I want 2 Zinger Burgers", 
    time: "15m", 
    unread: 0, 
    status: 'BOT_ACTIVE', 
    avatarColor: "bg-green-100 text-green-600"
  },
  { 
    id: 3, 
    name: "John Doe", 
    phone: "+92 333 5555555", 
    lastMessage: "Address updated.", 
    time: "1h", 
    unread: 0, 
    status: 'BOT_ACTIVE',
    avatarColor: "bg-purple-100 text-purple-600"
  },
];

export const MOCK_MESSAGES: ChatMessage[] = [
  { id: 1, sender: 'customer', text: "Hi, I want to order.", time: "10:00 AM" },
  { id: 2, sender: 'bot', text: "Welcome to Assan Store! 🍔\n1. View Menu\n2. Track Order\n3. Talk to Staff", time: "10:00 AM" },
  { id: 3, sender: 'customer', text: "3", time: "10:01 AM" },
  { id: 4, sender: 'system', text: "Bot paused. Agent requested.", time: "10:01 AM", type: 'alert' },
  { id: 5, sender: 'customer', text: "Where is my order?", time: "10:02 AM" },
];

export const MOCK_CUSTOMER_CONTEXT: CustomerContext = {
  id: 1,
  totalSpent: "$145.00",
  lastOrderDate: "2 days ago",
  recentOrders: [
    { id: "ORD-101", items: "2x Zinger", status: "Delivered", date: "Jan 20" },
    { id: "ORD-098", items: "1x Large Pizza", status: "Delivered", date: "Jan 15" },
  ]
};


export const MOCK_BUSINESS = {
    name: "Burger Point",
    logo: "🍔",
    description: "Best smash burgers in town. Halal & Fresh.",
  };
  
  export const MOCK_PRODUCTS = [
    {
      id: 1,
      name: "Classic Smash Burger",
      description: "Double beef patty, cheddar cheese, special sauce.",
      price: 8.50,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60",
      category: "Burgers"
    },
    {
      id: 2,
      name: "Spicy Zinger",
      description: "Crispy fried chicken, spicy mayo, lettuce.",
      price: 6.00,
      image: "https://images.unsplash.com/photo-1615557960916-5f4791effe9d?auto=format&fit=crop&w=500&q=60",
      category: "Burgers"
    },
    {
      id: 3,
      name: "Loaded Fries",
      description: "Fries topped with cheese sauce and jalapeños.",
      price: 4.50,
      image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=500&q=60",
      category: "Sides"
    },
    {
      id: 4,
      name: "Coca Cola",
      description: "Chilled 330ml can.",
      price: 1.50,
      image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=60",
      category: "Drinks"
    },
  ];