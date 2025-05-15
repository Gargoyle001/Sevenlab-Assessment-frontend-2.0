export interface Product {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  category: string
  image_url: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  status: 'pending' | 'paid' | 'shipped' | 'completed'
  payment_method: 'ideal' | 'creditcard' | 'pay_later'
  total_amount: number
  billing_address: Address
  shipping_address: Address
  created_at: string
}

export interface Address {
  street: string
  city: string
  state: string
  postal_code: string
  country: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price_at_time: number
}

export interface Invoice {
  id: string
  order_id: string
  amount: number
  due_date: string
  status: 'pending' | 'paid' | 'overdue'
  email_sent: boolean
} 