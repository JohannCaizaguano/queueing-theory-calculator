import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useQueueStore } from '@/store/useQueueStore'
import { translations } from '@/lib/i18n'
import { Percent, Ruler, Clock } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: number | null
  unit?: string
}

function MetricCard({ label, value, unit }: MetricCardProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-mono text-sm font-semibold tabular-nums">
        {value !== null ? value.toFixed(4) : '—'}
        {unit && <span className="ml-1 text-[10px] text-muted-foreground font-normal">{unit}</span>}
      </span>
    </div>
  )
}

export function MetricsDashboard(): React.JSX.Element {
  const { metrics, isCalculating, language } = useQueueStore()
  const t = translations[language]

  if (isCalculating) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2"><Skeleton className="h-4 w-32" /></CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Probabilities */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Percent className="h-4 w-4 text-chart-1" />
            {t.probabilities}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <MetricCard label={t.p0Label} value={metrics?.P0 ?? null} />
          <MetricCard label={t.pkLabel} value={metrics?.Pk ?? null} />
          <MetricCard label={t.pneLabel} value={metrics?.Pne ?? null} />
        </CardContent>
      </Card>

      {/* Lengths */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Ruler className="h-4 w-4 text-chart-2" />
            {t.lengths}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <MetricCard label={t.lLabel} value={metrics?.L ?? null} unit={t.unitClients} />
          <MetricCard label={t.lqLabel} value={metrics?.Lq ?? null} unit={t.unitClients} />
          <MetricCard label={t.lnLabel} value={metrics?.Ln ?? null} unit={t.unitClients} />
        </CardContent>
      </Card>

      {/* Times */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-chart-4" />
            {t.times}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <MetricCard label={t.wLabel} value={metrics?.W ?? null} unit={t.unitHours} />
          <MetricCard label={t.wqLabel} value={metrics?.Wq ?? null} unit={t.unitHours} />
          <MetricCard label={t.wnLabel} value={metrics?.Wn ?? null} unit={t.unitHours} />
        </CardContent>
      </Card>
    </div>
  )
}
