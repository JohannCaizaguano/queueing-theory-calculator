import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { Calculator, Server, Users, Infinity as InfinityIcon, Globe } from 'lucide-react'
import { useQueueStore, MODELS, type ModelType } from '@/store/useQueueStore'
import { translations } from '@/lib/i18n'

const modelIcons: Record<ModelType, React.ReactNode> = {
  PICS: <Server className="h-4 w-4" />,
  PICM: <Users className="h-4 w-4" />,
  PFCS: <Calculator className="h-4 w-4" />,
  PFCM: <InfinityIcon className="h-4 w-4" />,
}

export function AppSidebar(): React.JSX.Element {
  const { selectedModel, setModel, language, setLanguage } = useQueueStore()
  const t = translations[language]

  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="p-4 [-webkit-app-region:drag]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight">{t.appTitle}</h2>
            <p className="text-xs text-muted-foreground">{t.appSubtitle}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70">
            {t.mathModels}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MODELS.map((model) => (
                <SidebarMenuItem key={model.id}>
                  <SidebarMenuButton
                    isActive={selectedModel === model.id}
                    onClick={() => setModel(model.id)}
                    className="group !h-auto py-2"
                  >
                    <div className="mt-0.5">{modelIcons[model.id]}</div>
                    <div className="flex flex-col min-w-0">
                      <span className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{model.name}</span>
                        <Badge variant="outline" className="text-[10px] px-1 py-0 font-mono shrink-0">
                          {model.kendall}
                        </Badge>
                      </span>
                      <span className="text-[10px] text-muted-foreground leading-tight line-clamp-2 pr-2">
                        {t[model.description as keyof typeof t]}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Globe className="h-3 w-3 text-muted-foreground" />
          <button
            onClick={() => setLanguage('es')}
            className={`text-xs px-2 py-1 rounded transition-colors ${language === 'es' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'}`}
          >
            ES
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`text-xs px-2 py-1 rounded transition-colors ${language === 'en' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'}`}
          >
            EN
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center">
          {t.simulationVersion}
        </p>
      </SidebarFooter>
    </Sidebar>
  )
}
