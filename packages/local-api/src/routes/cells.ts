import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import defaultCells from '../default'

type CellTypes = 'code' | 'text'
interface Cell {
    id: string
    type: CellTypes
    content: string
}

interface LocalApiError {
    code: string
}

export const createCellsRouter = (filename: string , dir: string) => {
    const router = express.Router()
    router.use(express.json())
    const fullPath = path.join(dir, filename)

    router.get('/cells', async (req, res) => {
        const isLocalApiError = (err: any): err is LocalApiError => {
            return typeof err.code === 'string'
        }

        try{
            const result = await fs.readFile(fullPath, { encoding: 'utf-8'})
            res.send(JSON.parse(result))
        }catch(err){
            if(isLocalApiError(err)){
                if(err.code === 'ENOENT'){
                    console.log(`${err.code}! file does not exist, creating a default data`)
                    await fs.writeFile(fullPath, defaultCells , 'utf-8')
                    res.send(defaultCells) 
                }
            }else{
                throw err
            }
        }
    })
    
    router.post('/cells', async (req, res) => {
        const { cells }: {cells :Cell[]} = req.body
        

        await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8')
        res.send({ status: 'ok'})
    })

    return router

}



