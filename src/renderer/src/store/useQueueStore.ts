import { create } from 'zustand'
import {
  type QueueMetrics,
  type CostDataPoint,
  calcPICS,
  calcPICM,
  calcPFCS,
  calcPFCM,
  generateWqVsMuData,
  generateProbabilities,
  generateCostOptimizationData,
} from '@renderer/math/queueModels'

export type ModelType = 'PICS' | 'PICM' | 'PFCS' | 'PFCM'

export interface ModelInfo {
  id: ModelType
  name: string
  kendall: string
  description: string
  needsK: boolean
  needsM: boolean
}

export const MODELS: ModelInfo[] = [
  { id: 'PICS', name: 'PICS', kendall: 'M/M/1', description: 'PICS_desc', needsK: false, needsM: false },
  { id: 'PICM', name: 'PICM', kendall: 'M/M/k', description: 'PICM_desc', needsK: true, needsM: false },
  { id: 'PFCS', name: 'PFCS', kendall: 'M/M/1/M/M', description: 'PFCS_desc', needsK: false, needsM: true },
  { id: 'PFCM', name: 'PFCM', kendall: 'M/M/k/M/M', description: 'PFCM_desc', needsK: true, needsM: true },
]

interface QueueState {
  // Current model
  selectedModel: ModelType
  language: 'es' | 'en'

  // Input parameters
  lambda: number | ''
  mu: number | ''
  k: number | ''
  M: number | ''
  N: number | ''

  // Cost parameters (inputs)
  CTE: number | ''
  CTS: number | ''
  CTSE: number | ''
  CS: number | ''
  hoursPerDay: number | ''

  // Results
  metrics: QueueMetrics | null
  isStable: boolean
  isCalculating: boolean
  chartData: Array<{ mu: number; Wq: number }>

  // Computed arrays
  probabilities: Array<{ n: number; Pn: number }>
  costData: CostDataPoint[]
  CT: number | null

  // Actions
  setLanguage: (lang: 'es' | 'en') => void
  setModel: (model: ModelType) => void
  setLambda: (val: number | '') => void
  setMu: (val: number | '') => void
  setK: (val: number | '') => void
  setM: (val: number | '') => void
  setN: (val: number | '') => void
  setCTE: (val: number | '') => void
  setCTS: (val: number | '') => void
  setCTSE: (val: number | '') => void
  setCS: (val: number | '') => void
  setHoursPerDay: (val: number | '') => void
  calculate: () => void
}

export const useQueueStore = create<QueueState>((set, get) => ({
  selectedModel: 'PICS',
  language: 'es',
  lambda: '',
  mu: '',
  k: '',
  M: '',
  N: '',

  CTE: '',
  CTS: '',
  CTSE: '',
  CS: '',
  hoursPerDay: 8,

  metrics: null,
  isStable: true,
  isCalculating: false,
  chartData: [],
  probabilities: [],
  costData: [],
  CT: null,

  setLanguage: (lang) => set({ language: lang }),
  setModel: (model) => set({ selectedModel: model, metrics: null, chartData: [], probabilities: [], costData: [], CT: null }),
  setLambda: (val) => set({ lambda: val }),
  setMu: (val) => set({ mu: val }),
  setK: (val) => set({ k: val }),
  setM: (val) => set({ M: val }),
  setN: (val) => set({ N: val }),
  setCTE: (val) => set({ CTE: val }),
  setCTS: (val) => set({ CTS: val }),
  setCTSE: (val) => set({ CTSE: val }),
  setCS: (val) => set({ CS: val }),
  setHoursPerDay: (val) => set({ hoursPerDay: val }),

  calculate: () => {
    const state = get()
    const lambda = state.lambda === '' ? 0 : state.lambda;
    const mu = state.mu === '' ? 0 : state.mu;
    const k = state.k === '' ? 1 : state.k;
    const M = state.M === '' ? 1 : state.M;
    const N = state.N === '' ? 10 : state.N;
    const CTE = state.CTE === '' ? 0 : state.CTE;
    const CTS = state.CTS === '' ? 0 : state.CTS;
    const CTSE = state.CTSE === '' ? 0 : state.CTSE;
    const CS = state.CS === '' ? 0 : state.CS;
    const hoursPerDay = state.hoursPerDay === '' ? 8 : state.hoursPerDay;
    const selectedModel = state.selectedModel;

    set({ isCalculating: true })

    // Simulate a brief calculation "animation"
    setTimeout(() => {
      let result: QueueMetrics | null = null

      switch (selectedModel) {
        case 'PICS':
          result = calcPICS(lambda, mu)
          break
        case 'PICM':
          result = calcPICM(lambda, mu, k)
          break
        case 'PFCS':
          result = calcPFCS(lambda, mu, M)
          break
        case 'PFCM':
          result = calcPFCM(lambda, mu, k, M)
          break
      }

      const chartData = generateWqVsMuData(selectedModel, lambda, k, M)

      // Generate probability distribution
      const probabilities = generateProbabilities(selectedModel, lambda, mu, k, M, N)

      // Generate cost optimization data
      const costData = generateCostOptimizationData(
        selectedModel, lambda, mu, M, CTE, CTS, CTSE, CS, 10, hoursPerDay
      )

      // Compute current CT (for the current parameters)
      let CT: number | null = null
      if (result) {
        const lambdaEff = (selectedModel === 'PFCS' || selectedModel === 'PFCM')
          ? lambda * (M - result.L)
          : lambda
        const ctte = lambdaEff * hoursPerDay * result.Wq * CTE
        const ctts = lambdaEff * hoursPerDay * result.W * CTS
        const cttse = lambdaEff * hoursPerDay * (1 / mu) * CTSE
        const serverCount = (selectedModel === 'PICM' || selectedModel === 'PFCM') ? k : 1
        const cts = serverCount * CS
        
        // Prevent double counting if CTS > 0
        let ct_te_total = 0
        if (CTS > 0) {
          ct_te_total = ctts
        } else {
          ct_te_total = ctte + cttse
        }
        
        CT = Math.round((ct_te_total + cts) * 100) / 100
      }

      set({
        metrics: result,
        isStable: result !== null,
        isCalculating: false,
        chartData,
        probabilities,
        costData,
        CT,
      })
    }, 400)
  },
}))
