import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
  ReferenceDot, ReferenceLine
} from 'recharts'
import { useQueueStore, MODELS } from '@/store/useQueueStore'
import { translations } from '@/lib/i18n'
import { TrendingDown } from 'lucide-react'
import { useMemo } from 'react'

export function CostOptimizationChart(): React.JSX.Element {
  const { costData, selectedModel, language } = useQueueStore()
  const t = translations[language]
  const modelInfo = MODELS.find((m) => m.id === selectedModel)!
  const isMultiServer = selectedModel === 'PICM' || selectedModel === 'PFCM'
  const xLabel = isMultiServer ? t.serversAmount : t.serviceRateAmount

  // Find the minimum CT point
  const minPoint = useMemo(() => {
    if (costData.length === 0) return null
    return costData.reduce((min, point) => (point.CT < min.CT ? point : min), costData[0])
  }, [costData])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingDown className="h-4 w-4 text-chart-4" />
          {t.costOptTitle}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {t.model}: {modelInfo.name} — {t.variationOf}{' '}
          {xLabel} {t.vsDailyCosts}
          {minPoint && (
            <span className="ml-2 font-semibold text-emerald-600">
              Min CT = ${minPoint.CT.toFixed(2)} en{' '}
              {isMultiServer ? `k=${minPoint.variable}` : `μ=${minPoint.variable}`}
            </span>
          )}
        </p>
      </CardHeader>
      <CardContent>
        {costData.length > 0 ? (
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={costData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="ctGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.646 0.222 41.116)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.646 0.222 41.116)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.867 0.007 264.529 / 0.4)"
              />
              <XAxis
                dataKey="variable"
                label={{
                  value: xLabel,
                  position: 'insideBottom',
                  offset: -10,
                  style: { fontSize: 11 },
                }}
                tick={{ fontSize: 10 }}
                stroke="oklch(0.553 0.016 264.364)"
              />
              <YAxis
                label={{
                  value: t.costPerDay,
                  angle: -90,
                  position: 'insideLeft',
                  offset: -5,
                  style: { fontSize: 11 },
                }}
                tick={{ fontSize: 10 }}
                stroke="oklch(0.553 0.016 264.364)"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.984 0.003 247.858)',
                  border: '1px solid oklch(0.867 0.007 264.529)',
                  borderRadius: '8px',
                  fontSize: 12,
                }}
                formatter={(value: number, name: string) => {
                  const labels: Record<string, string> = {
                    CT_TE: t.costWaitSys,
                    CT_S: t.costServersAmount,
                    CT: t.costTotalLabel,
                  }
                  return [`$${value.toFixed(2)}`, labels[name] || name]
                }}
                labelFormatter={(label: number) =>
                  isMultiServer ? `k = ${label}` : `μ = ${label}`
                }
              />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
                formatter={(value: string) => {
                  const labels: Record<string, string> = {
                    CT_TE: t.costWaitSys,
                    CT_S: t.costServersAmount,
                    CT: t.costTotalLabel,
                  }
                  return labels[value] || value
                }}
              />
              {/* Vertical line at the minimum specific point */}
              {minPoint && (
                <ReferenceLine
                  x={minPoint.variable}
                  stroke="oklch(0.723 0.191 149.579)"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: 'Min(CT)',
                    position: 'top',
                    fill: 'oklch(0.723 0.191 149.579)',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                />
              )}
              <Line
                type="monotone"
                dataKey="CT_TE"
                stroke="oklch(0.646 0.222 41.116)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="CT_S"
                stroke="oklch(0.69 0.16 290.41)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="CT"
                stroke="oklch(0.56 0.13 43.00)"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              {/* Mark the minimum CT point */}
              {minPoint && (
                <ReferenceDot
                  x={minPoint.variable}
                  y={minPoint.CT}
                  r={8}
                  fill="oklch(0.723 0.191 149.579)"
                  stroke="oklch(0.723 0.191 149.579)"
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[340px] text-muted-foreground text-sm">
            {t.calculatePrompt}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
