import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createAuthClient } from "better-auth/vue"

const authClient = createAuthClient({
    baseURL: "https://api.motoguro.tech"
})

export const useAuthStore = defineStore('auth', () => {
    const isAuthenticated = ref(false)
    const user = ref(null)

    async function checkSession() {
        const { data } = await authClient.getSession()
        if (data) {
            isAuthenticated.value = true
            user.value = data.user
        } else {
            isAuthenticated.value = false
            user.value = null
        }
    }

    async function login(email, password) {
        const { data, error } = await authClient.signIn.email({
            email,
            password
        })
        
        if (!error && data) {
            isAuthenticated.value = true
            // user.value = data.user // better-auth might not return user immediately on sign in depending on config, but usually does
             await checkSession() // Refresh session to be sure
            return true
        }
        return false
    }

    async function logout() {
        await authClient.signOut()
        isAuthenticated.value = false
        user.value = null
    }

    async function register(name, email, password) {
         const { data, error } = await authClient.signUp.email({
            email,
            password,
            name
        })
         if (!error) {
             // Auto login after sign up if supported, or require login
             await checkSession()
             return true
         }
         return false
    }

    return {
        isAuthenticated,
        user,
        checkSession,
        login,
        logout,
        register
    }
})
