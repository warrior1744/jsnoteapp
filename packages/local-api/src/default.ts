
const defaultCells = JSON.stringify([{"content":"# JSNote\nThis is an interactive coding environment. You can write Javascript, see it executed, and write comprehensive documentation using markdown\n\n- Click any text cell (or this one) and start editing it\n- The code in each code editor is all joined together into one file. You can create as many cells as you want as they share the variables\n- You can create, delete or move any cell to a specific location\n- Adjust the frame size by holding the x or y bar\n\nAll the changes get saved to the file where you open this app.\nSimply give an file name as an optional argument when you start this app.\ne.g  npx jsnoteapp serve mynote.js\n\ncreated by Jim Chang 2022\nSource code please visit https://github.com/warrior1744/jsnoteapp.git\n","type":"text","id":"0166kwt"},{"content":"import { useState } from 'react';\nimport React from 'react'\nimport ReactDOM from 'react-dom/client'\n\nconst Counter = () => {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <button onClick={() => setCount(count + 1)}>Click</button>\n      <h3>Count: {count}</h3>\n    </div>\n  );\n};\n\nshow(<Counter/>)","type":"code","id":"pfdbqm3"}])






export default defaultCells