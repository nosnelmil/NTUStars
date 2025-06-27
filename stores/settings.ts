import { defineStore } from 'pinia'
import { Dark } from 'quasar';

interface SettingsState {
  openedHelpBefore: boolean;
  openedChangesBefore: boolean;
  leftDrawerOpen: boolean;
  rightDrawerOpen?: boolean;
  darkMode: boolean;
  changesDialogOpen?: boolean;
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => {
    return {
      openedHelpBefore: false,
      openedChangesBefore: false,
      leftDrawerOpen: false,
      rightDrawerOpen: false,
      darkMode: true,
    }
  },
  getters: {
    getInitalHelpModalState: (state) => {
      if (state.openedHelpBefore) {
        return false
      }
      state.openedHelpBefore = true
      return true
    },
    getInitalChangesModalState: (state) => {
      if (state.openedChangesBefore) {
        return false
      }
      state.openedChangesBefore = true
      return true
    },

  },
  actions: {
    setSettings() {
      Dark.set(this.darkMode)
    },
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
    setRightDrawerValue(value: boolean) {
      this.rightDrawerOpen = value
    },
    toggleRightDrawer() {
      this.rightDrawerOpen = !this.rightDrawerOpen
    },
    toggelDarkMode() {
      Dark.toggle()
      this.darkMode = Dark.isActive
      return Dark.isActive
    },
    toggleChangesDialog() {
      this.changesDialogOpen = !this.changesDialogOpen
    }
  },
  persist: true
})
