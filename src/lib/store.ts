import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AnalysisResult, DatasetHistory, User, Notification, AppSettings } from '@/types'

interface AppStore {
  // Data state
  currentAnalysis: AnalysisResult | null
  datasetHistory: DatasetHistory[]
  
  // UI state
  sidebarCollapsed: boolean
  currentPage: string
  
  // User state
  user: User | null
  notifications: Notification[]
  settings: AppSettings
  
  // Actions
  setCurrentAnalysis: (analysis: AnalysisResult | null) => void
  addToHistory: (dataset: DatasetHistory) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setCurrentPage: (page: string) => void
  setUser: (user: User | null) => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  markNotificationRead: (id: string) => void
  updateSettings: (settings: Partial<AppSettings>) => void
  clearNotifications: () => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentAnalysis: null,
      datasetHistory: [],
      sidebarCollapsed: false,
      currentPage: 'dashboard',
      user: null,
      notifications: [],
      settings: {
        darkMode: false,
        autoRefresh: true,
        refreshInterval: 10000,
        notifications: true,
        language: 'en'
      },

      // Actions
      setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
      
      addToHistory: (dataset) => set((state) => ({
        datasetHistory: [dataset, ...state.datasetHistory].slice(0, 50) // Keep last 50
      })),
      
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      
      setCurrentPage: (page) => set({ currentPage: page }),
      
      setUser: (user) => set({ user }),
      
      addNotification: (notification) => set((state) => ({
        notifications: [{
          ...notification,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          read: false
        }, ...state.notifications].slice(0, 100) // Keep last 100
      })),
      
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        )
      })),
      
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      
      clearNotifications: () => set({ notifications: [] })
    }),
    {
      name: 'smart-hx-storage',
      partialize: (state) => ({
        datasetHistory: state.datasetHistory,
        settings: state.settings,
        user: state.user
      })
    }
  )
)