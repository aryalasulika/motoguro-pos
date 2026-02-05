import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { isSameDay } from 'date-fns'
import axios from 'axios'

// Create axios instance with credentials for cookie handling
const api = axios.create({
  baseURL: 'https://api.motoguro.tech/api',
  withCredentials: true
})

export const useFinanceStore = defineStore('finance', () => {
  // State
  const transactions = ref([])
  const serviceTypes = ref([])
  
  // -- Transactions Actions --
  async function fetchTransactions() {
    try {
      const response = await api.get('/transactions')
      transactions.value = response.data
    } catch (e) {
      console.error('Failed to fetch transactions', e)
    }
  }

  async function addTransaction(transaction) {
    try {
      const response = await api.post('/transactions', transaction)
      transactions.value.unshift(response.data)
    } catch (e) {
      console.error('Failed to add transaction', e)
      throw e
    }
  }

  async function updateTransaction(id, updates) {
    try {
        const response = await api.put(`/transactions/${id}`, updates)
        const index = transactions.value.findIndex(t => t.id === id)
        if (index !== -1) {
            transactions.value[index] = response.data
        }
    } catch (e) {
        console.error('Failed to update transaction', e)
        throw e
    }
  }

  async function deleteTransaction(id) {
    try {
      await api.delete(`/transactions/${id}`)
      transactions.value = transactions.value.filter(t => t.id !== id)
    } catch (e) {
      console.error('Failed to delete transaction', e)
    }
  }

  // -- Services Actions --
  async function fetchServices() {
    try {
        const response = await api.get('/services')
        serviceTypes.value = response.data
    } catch (e) {
        console.error('Failed to fetch services', e)
    }
  }

  async function addService(service) {
    try {
        const response = await api.post('/services', service)
        serviceTypes.value.push(response.data)
    } catch (e) {
        console.error('Failed to add service', e)
        throw e
    }
  }

  async function updateService(id, updates) {
      try {
          const response = await api.put(`/services/${id}`, updates)
          const index = serviceTypes.value.findIndex(s => s.id === id)
          if (index !== -1) {
              serviceTypes.value[index] = response.data
          }
      } catch (e) {
          console.error('Failed to update service', e)
          throw e
      }
  }

  async function deleteService(id) {
      try {
          await api.delete(`/services/${id}`)
          serviceTypes.value = serviceTypes.value.filter(s => s.id !== id)
      } catch (e) {
          console.error('Failed to delete service', e)
          throw e
      }
  }

  // Getters
  const todayTransactions = computed(() => {
    const today = new Date()
    return transactions.value.filter(t => isSameDay(new Date(t.date), today))
  })

  const incomeToday = computed(() => {
    return todayTransactions.value
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const expenseToday = computed(() => {
    return todayTransactions.value
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const netProfitToday = computed(() => incomeToday.value - expenseToday.value)

  const recentActivity = computed(() => {
    return transactions.value.slice(0, 10)
  })

  return {
    transactions,
    serviceTypes,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    fetchServices,
    addService,
    updateService,
    deleteService,
    todayTransactions,
    incomeToday,
    expenseToday,
    netProfitToday,
    recentActivity
  }
})
