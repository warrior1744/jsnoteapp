import { useTypedSelector } from "./useTypedSelector"


/**
 * map all the codes in cells, filter them out with 'code' and 
 * make an array of the codes 
 * finally, do the bundles on each cells
 */

/**
 * How to cumulative previous cells in a single code? 
 * 1. Every component includes codes in previous cells
 * 2. Cells not correspondant with the Cell Id in the component will be included with empty expression in show function 
 * 3. Every component has its own show() function overrides the older function
 * 4. Each component won't include codes in the next cell component
 */
export const useCumulativeCode = (cellId: string) => {

  return useTypedSelector((state) => {
    const {data, order} = state.cells
    const allOrderCells = order.map((id) => data[id])
    const showFunc =  `
        import _React from 'react'
        import _ReactDOM from 'react-dom'
        var show = (value) => {
        const root = document.querySelector('#root')
        if (typeof value === 'object'){
            if (value.$$typeof && value.props){
            _ReactDOM.render(value, root)
            }else {
            root.innerHTML = JSON.stringify(value)
            }
        } else {
            root.innerHTML = value
        }
        }
    `
    const showFuncNoop = 'var show = () => {}'
    const cumulativeCode = []

    for (let cell of allOrderCells){
      if(cell.type === 'code'){
        if(cell.id === cellId){
          cumulativeCode.push(showFunc)
        }else{
          cumulativeCode.push(showFuncNoop)
        }
        cumulativeCode.push(cell.content)
      }
      if(cell.id === cellId){
        break
      }
    }
    // console.log('cell Id', cellId)
    // console.log('cumulativeCode', cumulativeCode)
    return cumulativeCode
  }).join('\n')  //convert to a single string given by an array of codes
}