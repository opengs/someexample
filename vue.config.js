module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    proxy: 'https://numberplates.msht.eu:14556'
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/device_integrator_panel/' : '/'
}