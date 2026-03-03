export type ServiceKey =
  | 'staff'
  | 'manager'
  | 'customer'
  | 'catalog'
  | 'book'
  | 'cart'
  | 'order'
  | 'ship'
  | 'pay'
  | 'commentRate'
  | 'recommenderAi'
  | 'apiGateway'

export type ServiceInfo = {
  key: ServiceKey
  name: string
  baseUrl: string
  healthPath: string
}

// Ports follow docker-compose.yml:
// staff 8000, manager 8001, customer 8002, catalog 8003, book 8004,
// cart 8005, order 8006, ship 8007, pay 8008, comment-rate 8009,
// recommender-ai 8010, api-gateway 8011.
export const SERVICES: ServiceInfo[] = [
  { key: 'staff', name: 'Staff Service', baseUrl: 'http://localhost:8000', healthPath: '/health/' },
  { key: 'manager', name: 'Manager Service', baseUrl: 'http://localhost:8001', healthPath: '/health/' },
  { key: 'customer', name: 'Customer Service', baseUrl: 'http://localhost:8002', healthPath: '/health/' },
  { key: 'catalog', name: 'Catalog Service', baseUrl: 'http://localhost:8003', healthPath: '/health/' },
  { key: 'book', name: 'Book Service', baseUrl: 'http://localhost:8004', healthPath: '/health/' },
  { key: 'cart', name: 'Cart Service', baseUrl: 'http://localhost:8005', healthPath: '/health/' },
  { key: 'order', name: 'Order Service', baseUrl: 'http://localhost:8006', healthPath: '/health/' },
  { key: 'ship', name: 'Ship Service', baseUrl: 'http://localhost:8007', healthPath: '/health/' },
  { key: 'pay', name: 'Pay Service', baseUrl: 'http://localhost:8008', healthPath: '/health/' },
  { key: 'commentRate', name: 'Comment/Rate Service', baseUrl: 'http://localhost:8009', healthPath: '/health/' },
  { key: 'recommenderAi', name: 'Recommender AI Service', baseUrl: 'http://localhost:8010', healthPath: '/health/' },
  { key: 'apiGateway', name: 'API Gateway', baseUrl: 'http://localhost:8011', healthPath: '/health/' },
]

export type HealthState =
  | { status: 'loading' }
  | { status: 'up'; payload: unknown }
  | { status: 'down'; error: string }

export async function checkHealth(service: ServiceInfo): Promise<HealthState> {
  try {
    const res = await fetch(service.baseUrl + service.healthPath, { method: 'GET' })
    if (!res.ok) {
      return { status: 'down', error: `HTTP ${res.status}` }
    }
    const payload = (await res.json()) as unknown
    return { status: 'up', payload }
  } catch (e) {
    return { status: 'down', error: e instanceof Error ? e.message : String(e) }
  }
}

