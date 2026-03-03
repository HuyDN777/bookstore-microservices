export type Book = {
  id: string
  title: string
  author: string
  price: number
  cover: string
  shortDescription: string
  description: string
  tags: string[]
}

// Dữ liệu mock chỉ để hiển thị UI. Sau này bạn có thể thay thế bằng API từ book-service.
export const BOOKS: Book[] = [
  {
    id: 'clean-code',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    price: 29.9,
    cover:
      'https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX374_BO1,204,203,200_.jpg',
    shortDescription: 'Cẩm nang viết code sạch, dễ bảo trì và dễ đọc.',
    description:
      'Clean Code là cuốn sách kinh điển giúp lập trình viên nâng cao kỹ năng viết mã nguồn sạch, rõ ràng và dễ bảo trì. Sách đưa ra nhiều nguyên tắc, pattern và anti-pattern với ví dụ cụ thể.',
    tags: ['Programming', 'Best Practices'],
  },
  {
    id: 'ddd',
    title: 'Domain-Driven Design',
    author: 'Eric Evans',
    price: 39.5,
    cover: 'https://images-na.ssl-images-amazon.com/images/I/51ZrHqQ+q9L._SX379_BO1,204,203,200_.jpg',
    shortDescription: 'Thiết kế phần mềm phức tạp xoay quanh domain.',
    description:
      'Domain-Driven Design giới thiệu cách tiếp cận thiết kế hệ thống phức tạp bằng cách tập trung vào domain và ubiquitous language, rất phù hợp với kiến trúc microservices.',
    tags: ['Architecture', 'Microservices'],
  },
  {
    id: 'pragmatic-programmer',
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt, David Thomas',
    price: 25.0,
    cover: 'https://images-na.ssl-images-amazon.com/images/I/41as+WafrFL._SX258_BO1,204,203,200_.jpg',
    shortDescription: 'Những lời khuyên thực tế cho lập trình viên chuyên nghiệp.',
    description:
      'The Pragmatic Programmer tổng hợp những lời khuyên, kinh nghiệm, best practices giúp lập trình viên làm việc hiệu quả, tránh sai lầm thường gặp.',
    tags: ['Programming', 'Career'],
  },
]

export function getBookById(id: string): Book | undefined {
  return BOOKS.find((b) => b.id === id)
}

