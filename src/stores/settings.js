import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => {
    return {
      openedHelpBefore: false,
    }
  },
  
  getters: {
    getInitalHelpModalState: (state) => {
      if (state.openedHelpBefore) {
        return false
      }
      state.openedHelpBefore = true
      return true
    }
  },
  actions: {},
  persist: true
})
