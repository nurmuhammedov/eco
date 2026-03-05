import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'uz.technocorp.ecosystem',
  appName: 'Ekotizim',
  webDir: 'dist',
  server: {
    url: 'https://test.cirns.uz',
    cleartext: true,
    allowNavigation: ['test.cirns.uz', 'ekotizim.cirns.uz'],
  },
}

export default config
