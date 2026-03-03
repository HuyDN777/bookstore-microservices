export function Placeholder({ title }: { title: string }) {
  return (
    <div className="page">
      <h1 className="h1">{title}</h1>
      <p className="muted">
        Trang này là khung sẵn để nối API cho service tương ứng. Hiện tại backend của bạn mới có
        endpoint <code>/health/</code> nên chưa có dữ liệu nghiệp vụ để hiển thị.
      </p>
    </div>
  )
}

