import app from "./src/app"
import { config } from "./src/config/config"

const runServer = ()=>{
    const port = config.port || 2580
    app.listen(port, ()=>{
        console.log(`Server is runing on port http://localhost:${port}`)
    })
}

runServer()
