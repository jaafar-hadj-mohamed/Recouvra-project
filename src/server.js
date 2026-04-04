import { initApp } from './app.js'

const start = async () => {
  try {
    const app = await initApp()
    const port = process.env.PORT || 3000
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`)
    })
  } catch (e) {
    console.error('Failed to start server', e)
    process.exit(1)
  }
}

start()
