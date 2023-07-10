import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => {
    return {
      openedHelpBefore: false,
      leftDrawerOpen: true,
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
  actions: {
    toggleLeftDrawer(){
      this.leftDrawerOpen = !this.leftDrawerOpen
    }
  },
  persist: true
})
