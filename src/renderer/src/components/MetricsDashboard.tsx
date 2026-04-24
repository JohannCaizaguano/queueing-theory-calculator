import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useQueueStore } from '@/store/useQueueStore'
import { translations } from '@/lib/i18n'
import { Percent, Ruler, Clock } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: number | null
  unit?: string
  secondaryText?: string
}

function MetricCard({ label, value, unit, secondaryText }: MetricCardProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-mono text-sm font-semibold tabular-nums">
        {value !== null ? value.toFixed(4) : '—'}
        {value !== null && secondaryText && (
          <span className="ml-1 text-[12px] text-muted-foreground font-normal">({secondaryText})</span>
        )}
        {unit && <span className="ml-1 text-[12px] text-muted-foreground font-normal">{unit}</span>}
      </span>
    </div>
  )
}

export function MetricsDashboard(): React.JSX.Element {
  const { metrics, isCalculating, language } = useQueueStore()
  const t = translations[language]
  const [showMinutes, setShowMinutes] = useState(false)

  const formatAsPercent = (value: number | null): string | undefined => {
    if (value === null) return undefined
    return `${(value * 100).toFixed(2)}%`
  }

  const displayedTime = (value: number | null): number | null => {
    if (value === null) return null
    return showMinutes ? value * 60 : value
  }

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
          <MetricCard
            label={t.p0Label}
            value={metrics?.P0 ?? null}
            secondaryText={formatAsPercent(metrics?.P0 ?? null)}
          />
          <MetricCard
            label={t.pkLabel}
            value={metrics?.Pk ?? null}
            secondaryText={formatAsPercent(metrics?.Pk ?? null)}
          />
          <MetricCard
            label={t.pneLabel}
            value={metrics?.Pne ?? null}
            secondaryText={formatAsPercent(metrics?.Pne ?? null)}
          />
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
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-chart-4" />
              {t.times}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Checkbox
                id="show-minutes"
                checked={showMinutes}
                onCheckedChange={(checked) => setShowMinutes(checked === true)}
              />
              <Label htmlFor="show-minutes" className="text-xs text-muted-foreground cursor-pointer">
                {t.showMinutes}
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <MetricCard
            label={t.wLabel}
            value={displayedTime(metrics?.W ?? null)}
            unit={showMinutes ? t.unitMinutes : t.unitHours}
          />
          <MetricCard
            label={t.wqLabel}
            value={displayedTime(metrics?.Wq ?? null)}
            unit={showMinutes ? t.unitMinutes : t.unitHours}
          />
          <MetricCard
            label={t.wnLabel}
            value={displayedTime(metrics?.Wn ?? null)}
            unit={showMinutes ? t.unitMinutes : t.unitHours}
          />
        </CardContent>
      </Card>
    </div>
  )
}
