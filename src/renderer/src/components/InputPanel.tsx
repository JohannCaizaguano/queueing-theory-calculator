import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Info, Loader2, DollarSign, Eraser } from 'lucide-react'
import { useQueueStore, MODELS } from '@/store/useQueueStore'
import { translations } from '@/lib/i18n'

export function InputPanel(): React.JSX.Element {
  const {
    selectedModel, lambda, mu, k, M, N,
    CTE, CTS, CTSE, CS, CT, hoursPerDay,
    setLambda, setMu, setK, setM, setN,
    setCTE, setCTS, setCTSE, setCS, setHoursPerDay,
    calculate, clearAll, isCalculating, language,
  } = useQueueStore()
  const t = translations[language]

  const modelInfo = MODELS.find((m) => m.id === selectedModel)!

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{t.inputParams}</CardTitle>
          <Button
            onClick={clearAll}
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Lambda */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Label htmlFor="lambda" className="text-sm font-medium">
              {t.lambdaLabel}
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t.lambdaTooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="lambda"
            type="number"
            step="0.1"
            min="0.1"
            placeholder="0"
            value={lambda}
            onChange={(e) => setLambda(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="font-mono"
          />
        </div>

        {/* Mu */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Label htmlFor="mu" className="text-sm font-medium">
              {t.muLabel}
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t.muTooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="mu"
            type="number"
            step="0.1"
            min="0.1"
            placeholder="0"
            value={mu}
            onChange={(e) => setMu(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="font-mono"
          />
        </div>

        {/* k (Servers) — conditional */}
        {modelInfo.needsK && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="k" className="text-sm font-medium">
                {t.kLabel}
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t.kTooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="k"
              type="number"
              step="1"
              min="1"
              placeholder="0"
              value={k}
              onChange={(e) => setK(e.target.value === '' ? '' : parseInt(e.target.value))}
              className="font-mono"
            />
          </div>
        )}

        {/* M (Population) — conditional */}
        {modelInfo.needsM && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="M" className="text-sm font-medium">
                {t.mLabel}
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t.mTooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="M"
              type="number"
              step="1"
              min="1"
              placeholder="0"
              value={M}
              onChange={(e) => setM(e.target.value === '' ? '' : parseInt(e.target.value))}
              className="font-mono"
            />
          </div>
        )}

        {/* N (Probability limit) */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Label htmlFor="N" className="text-sm font-medium">
              {t.nLabel}
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t.nTooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="N"
            type="number"
            step="1"
            min="1"
            placeholder="0"
            value={N}
            onChange={(e) => setN(e.target.value === '' ? '' : parseInt(e.target.value))}
            className="font-mono mb-4"
          />
        </div>

        {/* Calculate Button */}
        <Button
          onClick={calculate}
          disabled={isCalculating}
          className="w-full mb-4"
          size="lg"
        >
          {isCalculating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.calculating}
            </>
          ) : (
            t.calculate
          )}
        </Button>

        {/* Cost Accordion */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="costs" className="border-border/50">
            <AccordionTrigger className="text-sm py-3 hover:no-underline">
              <span className="flex items-center gap-2">
                <DollarSign className="h-3.5 w-3.5 text-chart-4" />
                {t.economicAnalysis}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-1">
                <div className="space-y-1.5">
                  <Label htmlFor="CTE" className="text-xs">
                    {t.cteLabel}
                  </Label>
                  <Input
                    id="CTE"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0"
                    value={CTE}
                    onChange={(e) => setCTE(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="CTS" className="text-xs">
                    {t.ctsLabel}
                  </Label>
                  <Input
                    id="CTS"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0"
                    value={CTS}
                    onChange={(e) => setCTS(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="CTSE" className="text-xs">
                    {t.ctseLabel}
                  </Label>
                  <Input
                    id="CTSE"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0"
                    value={CTSE}
                    onChange={(e) => setCTSE(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="CS" className="text-xs">
                    {t.csLabel}
                  </Label>
                  <Input
                    id="CS"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0"
                    value={CS}
                    onChange={(e) => setCS(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="hoursPerDay" className="text-xs">
                    {t.hoursPerDayLabel}
                  </Label>
                  <Input
                    id="hoursPerDay"
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="24"
                    placeholder="8"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="font-mono text-sm"
                  />
                </div>

                {/* CT (read-only output) */}
                <div className="space-y-1.5 pt-2 border-t border-border/40">
                  <Label htmlFor="CT" className="text-xs font-semibold">
                    {t.ctLabel}
                  </Label>
                  <Input
                    id="CT"
                    type="text"
                    disabled
                    value={CT !== null ? `$ ${CT.toFixed(2)}` : '—'}
                    className="font-mono text-sm bg-muted/50 font-semibold"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
