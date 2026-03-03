import { useEffect, useMemo, useState } from 'react'
import { checkHealth, type HealthState, SERVICES } from '../lib/services'

type Row = {
  key: string
  name: string
  baseUrl: string
  state: HealthState
}

export function Dashboard() {
  const initialRows = useMemo<Row[]>(
    () =>
      SERVICES.map((s) => ({
        key: s.key,
        name: s.name,
        baseUrl: s.baseUrl,
        state: { status: 'loading' } as HealthState,
      })),
    [],
  )

  const [rows, setRows] = useState<Row[]>(initialRows)
  const [lastCheckedAt, setLastCheckedAt] = useState<Date | null>(null)

  async function refresh() {
    setRows((prev) => prev.map((r) => ({ ...r, state: { status: 'loading' } })))
    const results = await Promise.all(
      SERVICES.map(async (svc) => ({
        key: svc.key,
        state: await checkHealth(svc),
      })),
    )
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        state: results.find((x) => x.key === r.key)?.state ?? r.state,
      })),
    )
    setLastCheckedAt(new Date())
  }

  useEffect(() => {
    void refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const upCount = rows.filter((r) => r.state.status === 'up').length
  const downCount = rows.filter((r) => r.state.status === 'down').length

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h1 className="h1">Service Dashboard</h1>
          <p className="muted">
            Kiểm tra trạng thái các service bằng endpoint <code>/health/</code>.
          </p>
        </div>
        <div className="pageHeaderRight">
          <button className="btn" onClick={() => void refresh()}>
            Refresh
          </button>
        </div>
      </div>

      <div className="statsRow">
        <div className="statCard">
          <div className="statLabel">Up</div>
          <div className="statValue">{upCount}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Down</div>
          <div className="statValue">{downCount}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Last check</div>
          <div className="statValue statValueSmall">
            {lastCheckedAt ? lastCheckedAt.toLocaleTimeString() : '—'}
          </div>
        </div>
      </div>

      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Base URL</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key}>
                <td className="tdStrong">{r.name}</td>
                <td>
                  <code>{r.baseUrl}</code>
                </td>
                <td>
                  <StatusPill state={r.state} />
                </td>
                <td className="tdDetails">
                  {r.state.status === 'up' ? (
                    <pre className="json">{safeJson(r.state.payload)}</pre>
                  ) : r.state.status === 'down' ? (
                    <span className="muted">{r.state.error}</span>
                  ) : (
                    <span className="muted">Loading…</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="hint">
        Tip: chạy <code>docker compose up --build</code> để các service lên rồi bấm Refresh.
      </p>
    </div>
  )
}

function StatusPill({ state }: { state: HealthState }) {
  if (state.status === 'loading') return <span className="pill pillGray">Loading</span>
  if (state.status === 'up') return <span className="pill pillGreen">UP</span>
  return <span className="pill pillRed">DOWN</span>
}

function safeJson(v: unknown) {
  try {
    return JSON.stringify(v, null, 2)
  } catch {
    return String(v)
  }
}

