// ============================================================
// Queueing Theory Mathematical Models
// ============================================================
// Each model exports a function that receives the relevant
// parameters and returns a full set of performance metrics.
// ============================================================

export interface QueueMetrics {
  rho: number  // System utilization
  k?: number   // Number of servers

  // Probabilities
  P0: number   // Probability system is empty
  Pk: number   // Probability of k customers (or waiting)
  Pne: number  // Probability of NOT having to wait

  // Lengths
  L: number    // Average number of customers in the system
  Lq: number   // Average number of customers in queue
  Ln: number   // Average queue length (non-empty queue)

  // Times
  W: number    // Average time in system
  Wq: number   // Average time in queue
  Wn: number   // Average time in queue given customer waits
}

// ----------------------------------------------------------
// PICS — M/M/1 (Población Infinita, Cola Sin límite, 1 Servidor)
// ----------------------------------------------------------
export function calcPICS(lambda: number, mu: number): QueueMetrics | null {
  const rho = lambda / mu
  if (rho >= 1) return null // unstable

  const P0 = 1 - rho
  const Lq = (rho * rho) / (1 - rho)
  const L = rho / (1 - rho)
  const Wq = Lq / lambda
  const W = L / lambda
  const Ln = L // For M/M/1, Ln = 1 / (1 - rho)
  const Pk = rho // P(system busy)
  const Pne = P0 // P(no wait) = P(system empty)
  const Wn = Pk > 0 ? Wq / Pk : 0

  return {
    rho: round(rho),
    k: 1,
    P0: round(P0),
    Pk: round(Pk),
    Pne: round(Pne),
    L: round(L),
    Lq: round(Lq),
    Ln: round(1 / (1 - rho)),
    W: round(W),
    Wq: round(Wq),
    Wn: round(Wn),
  }
}

// ----------------------------------------------------------
// PICM — M/M/k (Población Infinita, Cola Sin límite, k Servidores)
// ----------------------------------------------------------
export function calcPICM(lambda: number, mu: number, k: number): QueueMetrics | null {
  const rho = lambda / (k * mu)
  if (rho >= 1) return null

  // P0 calculation
  let sumPart = 0
  for (let n = 0; n < k; n++) {
    sumPart += Math.pow(lambda / mu, n) / factorial(n)
  }
  const lastTerm = (Math.pow(lambda / mu, k) / factorial(k)) * (1 / (1 - rho))
  const P0 = 1 / (sumPart + lastTerm)

  // Pk (probability all servers busy — Erlang C)
  const Pk = (Math.pow(lambda / mu, k) / factorial(k)) * (1 / (1 - rho)) * P0

  const Lq = Pk * rho / (1 - rho)
  const L = Lq + lambda / mu
  const Wq = Lq / lambda
  const W = Wq + 1 / mu
  const Ln = Lq > 0 ? L / (1 - P0) : 0
  const Pne = 1 - Pk
  const Wn = Pk > 0 ? Wq / Pk : 0

  return {
    rho: round(rho),
    k,
    P0: round(P0),
    Pk: round(Pk),
    Pne: round(Pne),
    L: round(L),
    Lq: round(Lq),
    Ln: round(Ln),
    W: round(W),
    Wq: round(Wq),
    Wn: round(Wn),
  }
}

// ----------------------------------------------------------
// PFCS — M/M/1/M/M (Población Finita, 1 Servidor)
// ----------------------------------------------------------
export function calcPFCS(lambda: number, mu: number, M: number): QueueMetrics | null {
  if (M < 1 || lambda <= 0 || mu <= 0) return null

  // P0 calculation
  let sumP0 = 0
  for (let n = 0; n <= M; n++) {
    sumP0 += (factorial(M) / factorial(M - n)) * Math.pow(lambda / mu, n)
  }
  const P0 = 1 / sumP0

  const L = M - (mu / lambda) * (1 - P0)
  const Lq = M - ((lambda + mu) / lambda) * (1 - P0)

  const lambdaEff = lambda * (M - L)
  const Wq = lambdaEff > 0 ? Lq / lambdaEff : 0
  const W = Wq + 1 / mu
  
  const lambdaEmptyArrival = M * lambda * P0
  const Pk = lambdaEff > 0 ? 1 - (lambdaEmptyArrival / lambdaEff) : 0
  const Pne = 1 - Pk
  const Ln = Pk > 0 ? Lq / Pk : 0
  const Wn = Pk > 0 ? Wq / Pk : 0
  const rho = lambdaEff / mu

  return {
    rho: round(rho),
    k: 1,
    P0: round(P0),
    Pk: round(Pk),
    Pne: round(Pne),
    L: round(L),
    Lq: round(Lq),
    Ln: round(Ln),
    W: round(W),
    Wq: round(Wq),
    Wn: round(Wn),
  }
}

// ----------------------------------------------------------
// PFCM — M/M/k/M/M (Población Finita, k Servidores)
// ----------------------------------------------------------
export function calcPFCM(lambda: number, mu: number, k: number, M: number): QueueMetrics | null {
  if (M < 1 || k < 1 || lambda <= 0 || mu <= 0) return null

  // P0
  let sumP0 = 0
  for (let n = 0; n <= M; n++) {
    const combPart = factorial(M) / factorial(M - n)
    const serverPart = n <= k ? Math.pow(lambda / mu, n) / factorial(n)
      : Math.pow(lambda / mu, n) / (factorial(k) * Math.pow(k, n - k))
    sumP0 += combPart * serverPart
  }
  const P0 = 1 / sumP0

  let L = 0
  let Lq = 0
  let lambdaEff = 0
  let waitArrivalNum = 0
  
  for (let n = 0; n <= M; n++) {
    const combPart = factorial(M) / factorial(M - n)
    const serverPart = n <= k ? Math.pow(lambda / mu, n) / factorial(n)
      : Math.pow(lambda / mu, n) / (factorial(k) * Math.pow(k, n - k))
    const Pn = combPart * serverPart * P0
    
    L += n * Pn
    if (n > k) Lq += (n - k) * Pn
    if (n < M) lambdaEff += (M - n) * lambda * Pn
    if (n >= k && n < M) waitArrivalNum += (M - n) * lambda * Pn
  }

  const Wq = lambdaEff > 0 ? Lq / lambdaEff : 0
  const W = Wq + 1 / mu
  const Pk = lambdaEff > 0 ? waitArrivalNum / lambdaEff : 0
  const Pne = 1 - Pk
  const Ln = Pk > 0 ? Lq / Pk : 0
  const Wn = Pk > 0 ? Wq / Pk : 0
  const rho = lambdaEff > 0 ? lambdaEff / (k * mu) : 0

  return {
    rho: round(rho),
    k,
    P0: round(P0),
    Pk: round(Pk),
    Pne: round(Pne),
    L: round(L),
    Lq: round(Math.max(0, Lq)),
    Ln: round(Math.max(0, Ln)),
    W: round(W),
    Wq: round(Math.max(0, Wq)),
    Wn: round(Math.max(0, Wn)),
  }
}

// ----------------------------------------------------------
// Helpers
// ----------------------------------------------------------
export function factorial(n: number): number {
  if (n <= 1) return 1
  let result = 1
  for (let i = 2; i <= n; i++) result *= i
  return result
}

function round(value: number, decimals = 6): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

// Generate chart data: Wq vs mu for a given lambda, k, and model
export function generateWqVsMuData(
  model: 'PICS' | 'PICM' | 'PFCS' | 'PFCM',
  lambda: number,
  k: number,
  M: number,
  steps = 20
): Array<{ mu: number; Wq: number }> {
  const data: Array<{ mu: number; Wq: number }> = []
  const muMin = model === 'PICS' || model === 'PFCS' ? lambda * 1.05 : (lambda / k) * 1.05
  const muMax = muMin * 5

  for (let i = 0; i <= steps; i++) {
    const mu = muMin + (muMax - muMin) * (i / steps)
    let result: QueueMetrics | null = null

    switch (model) {
      case 'PICS': result = calcPICS(lambda, mu); break
      case 'PICM': result = calcPICM(lambda, mu, k); break
      case 'PFCS': result = calcPFCS(lambda, mu, M); break
      case 'PFCM': result = calcPFCM(lambda, mu, k, M); break
    }

    if (result) {
      data.push({ mu: round(mu, 2), Wq: round(result.Wq, 4) })
    }
  }

  return data
}

// ----------------------------------------------------------
// Probability Distribution: Pn for n = 0..N
// ----------------------------------------------------------
export function generateProbabilities(
  model: 'PICS' | 'PICM' | 'PFCS' | 'PFCM',
  lambda: number,
  mu: number,
  k: number,
  M: number,
  N: number
): Array<{ n: number; Pn: number }> {
  const results: Array<{ n: number; Pn: number }> = []

  switch (model) {
    case 'PICS': {
      const rho = lambda / mu
      if (rho >= 1) return results
      const P0 = 1 - rho
      for (let n = 0; n <= N; n++) {
        const Pn = P0 * Math.pow(rho, n)
        results.push({ n, Pn: round(Pn) })
      }
      break
    }

    case 'PICM': {
      const rho = lambda / (k * mu)
      if (rho >= 1) return results
      // Calculate P0
      let sumP0 = 0
      for (let i = 0; i < k; i++) {
        sumP0 += Math.pow(lambda / mu, i) / factorial(i)
      }
      sumP0 += (Math.pow(lambda / mu, k) / factorial(k)) * (1 / (1 - rho))
      const P0 = 1 / sumP0

      for (let n = 0; n <= N; n++) {
        let Pn: number
        if (n < k) {
          Pn = (Math.pow(lambda / mu, n) / factorial(n)) * P0
        } else {
          Pn = (Math.pow(lambda / mu, n) / (factorial(k) * Math.pow(k, n - k))) * P0
        }
        results.push({ n, Pn: round(Pn) })
      }
      break
    }

    case 'PFCS': {
      if (M < 1 || lambda <= 0 || mu <= 0) return results
      // Calculate P0
      let sumP0 = 0
      for (let i = 0; i <= M; i++) {
        sumP0 += (factorial(M) / factorial(M - i)) * Math.pow(lambda / mu, i)
      }
      const P0 = 1 / sumP0

      for (let n = 0; n <= N; n++) {
        if (n > M) {
          results.push({ n, Pn: 0 })
        } else {
          const Pn = (factorial(M) / factorial(M - n)) * Math.pow(lambda / mu, n) * P0
          results.push({ n, Pn: round(Pn) })
        }
      }
      break
    }

    case 'PFCM': {
      if (M < 1 || k < 1 || lambda <= 0 || mu <= 0) return results
      // Calculate P0
      let sumP0 = 0
      for (let i = 0; i <= M; i++) {
        const combPart = factorial(M) / factorial(M - i)
        const serverPart = i <= k
          ? Math.pow(lambda / mu, i) / factorial(i)
          : Math.pow(lambda / mu, i) / (factorial(k) * Math.pow(k, i - k))
        sumP0 += combPart * serverPart
      }
      const P0 = 1 / sumP0

      for (let n = 0; n <= N; n++) {
        if (n > M) {
          results.push({ n, Pn: 0 })
        } else {
          const combPart = factorial(M) / factorial(M - n)
          const serverPart = n <= k
            ? Math.pow(lambda / mu, n) / factorial(n)
            : Math.pow(lambda / mu, n) / (factorial(k) * Math.pow(k, n - k))
          const Pn = combPart * serverPart * P0
          results.push({ n, Pn: round(Pn) })
        }
      }
      break
    }
  }

  return results
}

// ----------------------------------------------------------
// Cost Optimization Data (8-hour workday)
// ----------------------------------------------------------
export interface CostDataPoint {
  variable: number
  CT_TE: number
  CT_S: number
  CT: number
}

export function generateCostOptimizationData(
  model: 'PICS' | 'PICM' | 'PFCS' | 'PFCM',
  lambda: number,
  mu: number,
  M: number,
  CTE: number,
  CTS: number,
  CTSE: number,
  CS: number,
  maxIterations = 10,
  hoursPerDay = 8
): CostDataPoint[] {
  const data: CostDataPoint[] = []

  if (model === 'PICM' || model === 'PFCM') {
    // Iterate over k (number of servers)
    for (let kIter = 1; kIter <= maxIterations; kIter++) {
      let result: QueueMetrics | null = null
      if (model === 'PICM') {
        result = calcPICM(lambda, mu, kIter)
      } else {
        result = calcPFCM(lambda, mu, kIter, M)
      }

      if (result) {
        const lambdaEff = model === 'PFCM' ? lambda * (M - result.L) : lambda
        const CTTE = lambdaEff * hoursPerDay * result.Wq * CTE
        const CTTS = lambdaEff * hoursPerDay * result.W * CTS
        const CTTSE = lambdaEff * hoursPerDay * (1 / mu) * CTSE
        const costServers = kIter * CS
        // Prevenir Solapamiento: Si CTS está definido (costo de tiempo en el sistema),
        // este ya engloba la espera y el servicio (ya que W = Wq + 1/mu).
        // Por ende, no sumaríamos doble.
        let CT_TE_total = 0
        if (CTS > 0) {
          CT_TE_total = round(CTTS, 2)
        } else {
          CT_TE_total = round(CTTE + CTTSE, 2)
        }
        
        const CT = round(CT_TE_total + costServers, 2)

        data.push({
          variable: kIter,
          CT_TE: CT_TE_total,
          CT_S: round(costServers, 2),
          CT,
        })
      }
    }
  } else {
    // PICS / PFCS — iterate over μ
    const muMin = model === 'PICS' ? lambda * 1.05 : lambda * 0.5
    const muMax = model === 'PICS' ? lambda * 5 : lambda * 5
    const steps = maxIterations > 0 ? maxIterations : 10

    for (let i = 0; i <= steps; i++) {
      const muIter = muMin + (muMax - muMin) * (i / steps)
      let result: QueueMetrics | null = null

      if (model === 'PICS') {
        result = calcPICS(lambda, muIter)
      } else {
        result = calcPFCS(lambda, muIter, M)
      }

      if (result) {
        const lambdaEff = model === 'PFCS' ? lambda * (M - result.L) : lambda
        const CTTE = lambdaEff * hoursPerDay * result.Wq * CTE
        const CTTS = lambdaEff * hoursPerDay * result.W * CTS
        const CTTSE = lambdaEff * hoursPerDay * (1 / muIter) * CTSE
        const costServers = CS // single server
        // Prevenir Solapamiento: si hay costo de sistema CTS, priorizarlo.
        let CT_TE_total = 0
        if (CTS > 0) {
          CT_TE_total = round(CTTS, 2)
        } else {
          CT_TE_total = round(CTTE + CTTSE, 2)
        }

        const CT = round(CT_TE_total + costServers, 2)

        data.push({
          variable: round(muIter, 2),
          CT_TE: CT_TE_total,
          CT_S: round(costServers, 2),
          CT,
        })
      }
    }
  }

  return data
}
