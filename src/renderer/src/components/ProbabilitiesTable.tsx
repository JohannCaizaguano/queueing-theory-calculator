import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useQueueStore } from '@/store/useQueueStore'
import { translations } from '@/lib/i18n'
import { ListOrdered } from 'lucide-react'

export function ProbabilitiesTable(): React.JSX.Element {
  const { probabilities, selectedModel, metrics, language } = useQueueStore()
  const t = translations[language]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <ListOrdered className="h-4 w-4 text-chart-2" />
          {t.probDistribution}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {t.model}: {selectedModel} — {t.probDesc}
        </p>
      </CardHeader>
      <CardContent>
        {probabilities.length > 0 && metrics !== null ? (
          <div className="max-h-[480px] overflow-y-auto rounded-md border border-border/50">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-[80px] text-center font-semibold">n</TableHead>
                  <TableHead className="text-center font-semibold">{t.state}</TableHead>
                  <TableHead className="text-right font-semibold">Pn</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {probabilities.map((row) => (
                  <TableRow
                    key={row.n}
                    className={row.n === 0 ? 'bg-primary/5' : ''}
                  >
                    <TableCell className="text-center font-mono font-semibold">
                      {row.n}
                    </TableCell>
                    <TableCell className="text-center text-xs text-muted-foreground">
                      {row.n === 0
                        ? t.emptySystem
                        : `${row.n} ${row.n > 1 ? t.customerPlural : t.customerSingular} ${t.inSystem}`}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {row.Pn.toFixed(6)}
                      <span className="ml-1 text-[11px] text-muted-foreground font-normal">
                        ({(row.Pn * 100).toFixed(2)}%)
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
            {t.calculatePrompt}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
