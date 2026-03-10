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
// Hàm tự động tạo URL tương ứng: Nếu ở Codespaces sẽ dùng link Codespaces, nếu ở nhà sẽ dùng localhost
function getBaseUrl(port: number) {
  if (typeof window !== 'undefined' && window.location.hostname.includes('app.github.dev')) {
    // Thay đổi port 5173 hiện tại thành port của backend tương ứng
    const codespaceHost = window.location.hostname.replace('-5173', `-${port}`);
    return `https://${codespaceHost}`;
  }
  return `http://localhost:${port}`;
}

export const SERVICES: ServiceInfo[] = [
  { key: 'staff', name: 'Staff Service', baseUrl: getBaseUrl(8000), healthPath: '/health/' },
  { key: 'manager', name: 'Manager Service', baseUrl: getBaseUrl(8001), healthPath: '/health/' },
  { key: 'customer', name: 'Customer Service', baseUrl: getBaseUrl(8002), healthPath: '/health/' },
  { key: 'catalog', name: 'Catalog Service', baseUrl: getBaseUrl(8003), healthPath: '/health/' },
  { key: 'book', name: 'Book Service', baseUrl: getBaseUrl(8004), healthPath: '/health/' },
  { key: 'cart', name: 'Cart Service', baseUrl: getBaseUrl(8005), healthPath: '/health/' },
  { key: 'order', name: 'Order Service', baseUrl: getBaseUrl(8006), healthPath: '/health/' },
  { key: 'ship', name: 'Ship Service', baseUrl: getBaseUrl(8007), healthPath: '/health/' },
  { key: 'pay', name: 'Pay Service', baseUrl: getBaseUrl(8008), healthPath: '/health/' },
  { key: 'commentRate', name: 'Comment/Rate Service', baseUrl: getBaseUrl(8009), healthPath: '/health/' },
  { key: 'recommenderAi', name: 'Recommender AI Service', baseUrl: getBaseUrl(8010), healthPath: '/health/' },
  { key: 'apiGateway', name: 'API Gateway', baseUrl: getBaseUrl(8011), healthPath: '/health/' },
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

