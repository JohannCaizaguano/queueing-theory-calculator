import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AppSidebar } from '@/components/AppSidebar'
import { InputPanel } from '@/components/InputPanel'
import { MetricsDashboard } from '@/components/MetricsDashboard'
import { ProbabilitiesTable } from '@/components/ProbabilitiesTable'
import { CostOptimizationChart } from '@/components/CostOptimizationChart'
import { useQueueStore, MODELS } from '@/store/useQueueStore'
import { translations } from '@/lib/i18n'
import { CheckCircle2, AlertTriangle } from 'lucide-react'

function App(): React.JSX.Element {
  const { selectedModel, isStable, metrics, language } = useQueueStore()
  const t = translations[language]
  const modelInfo = MODELS.find((m) => m.id === selectedModel)!

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0">
          {/* Header */}
          <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/40 px-6 [-webkit-app-region:drag]">
            <div className="[-webkit-app-region:no-drag]">
              <SidebarTrigger className="-ml-1" />
            </div>
            <Separator orientation="vertical" className="mx-2 h-4" />
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="min-w-0">
                <h1 className="text-sm font-semibold truncate">
                  {t.model} {modelInfo.name}
                  <span className="ml-2 font-mono text-xs text-muted-foreground">
                    ({modelInfo.kendall})
                  </span>
                </h1>
                <p className="text-[11px] text-muted-foreground truncate">
                  {t[modelInfo.description as keyof typeof t]}
                </p>
              </div>
              <div className="ml-auto shrink-0 pr-[140px] [-webkit-app-region:no-drag]">
                {metrics !== null ? (
                  isStable ? (
                    <Badge
                      variant="outline"
                      className="gap-1 text-emerald-600 border-emerald-600/30 bg-emerald-50"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {t.stable} {t.stableCondition}
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {t.unstable}
                    </Badge>
                  )
                ) : !isStable && metrics === null ? (
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {t.unstable} {t.unstableCondition}
                  </Badge>
                ) : null}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6 [-webkit-app-region:no-drag]">
            <Tabs defaultValue="calculos" className="space-y-4">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="calculos">{t.tabCalculations}</TabsTrigger>
                <TabsTrigger value="probabilidades">{t.tabProbabilities}</TabsTrigger>
                <TabsTrigger value="graficos">{t.tabCharts}</TabsTrigger>
              </TabsList>

              {/* Tab: Cálculos */}
              <TabsContent value="calculos" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <InputPanel />
                  <MetricsDashboard />
                </div>
              </TabsContent>

              {/* Tab: Probabilidades */}
              <TabsContent value="probabilidades">
                <ProbabilitiesTable />
              </TabsContent>

              {/* Tab: Gráficos */}
              <TabsContent value="graficos" className="space-y-6">
                <CostOptimizationChart />
              </TabsContent>
            </Tabs>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

export default App
