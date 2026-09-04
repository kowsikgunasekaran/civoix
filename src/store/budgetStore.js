import { create } from 'zustand'
import { DEFAULT_WEIGHTS, BUDGET_LINES } from '../data/budget'
import { CLUSTERS } from '../data/clusters'

function computeScore(cluster, weights) {
  const f = cluster.factors
  const w = weights
  const raw =
    w.demandIntensity.value   * f.demandIntensity +
    w.infraGapIndex.value     * f.infraGapIndex +
    w.equityWeight.value      * f.equityWeight +
    w.budgetFeasibility.value * f.budgetFeasibility +
    w.impactPotential.value   * f.impactPotential -
    w.redundancyPenalty.value * f.redundancyPenalty
  const maxPossible =
    w.demandIntensity.value + w.infraGapIndex.value + w.equityWeight.value +
    w.budgetFeasibility.value + w.impactPotential.value
  return Math.max(0, Math.min(1, raw / Math.max(maxPossible, 1)))
}

export const useBudgetStore = create((set, get) => ({
  weights: { ...DEFAULT_WEIGHTS },
  budgetCap: 100, // Cr
  budgetLines: [...BUDGET_LINES],
  rankedClusters: [...CLUSTERS].sort((a,b) => b.score - a.score),

  setWeight(key, val) {
    const weights = { ...get().weights, [key]:{ ...get().weights[key], value:val } }
    const rankedClusters = [...CLUSTERS]
      .map(c => ({ ...c, score: computeScore(c, weights) }))
      .sort((a,b) => b.score - a.score)
      .map((c,i) => ({ ...c, rank:i+1 }))
    set({ weights, rankedClusters })
  },

  setBudgetCap(cap) {
    set({ budgetCap:cap })
  },

  resetWeights() {
    set({ weights:{ ...DEFAULT_WEIGHTS }, rankedClusters:[...CLUSTERS].sort((a,b)=>b.score-a.score) })
  },
}))
