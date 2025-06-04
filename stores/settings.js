import { defineStore } from 'pinia'
// import { Dark } from 'quasar'

export const useSettingsStore = defineStore('settings', {
  state: () => {
    return {
      openedHelpBefore: false,
      openedChangesBefore: false,
      leftDrawerOpen: true,
      darkMode: false
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
  getInitalChangesModalState: (state) => {
    if (state.openedChangesBefore) {
      return false
    }
    state.openedChangesBefore = true
    return true
  },
  actions: {
    setSettings() {
      // Dark.set(this.darkMode)
    },
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
    toggelDarkMode() {
      // Dark.toggle()
      // this.darkMode = Dark.isActive
      // return Dark.isActive
    },
    toggleChangesDialog() {
      this.changesDialogOpen = !this.changesDialogOpen
    }
  },
  persist: true
})
