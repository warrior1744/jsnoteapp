import produce from 'immer'
import { ActionType } from "../action-types";
import {Action} from "../actions"

interface BundleState {
    [key:string] : {
        loading:boolean,
        code:string,
        err:string
    } | undefined // object may be undefined before the bundling
}

const initialState: BundleState = {}

const bundlesReducer = produce((
    state: BundleState = initialState,
    action: Action
): BundleState => {
    switch (action.type) {
        case ActionType.BUNDLE_START:
            state[action.payload.cellId] = {
                loading: true,
                code: '',
                err: ''
            }
            return state
        case ActionType.BUNDLE_COMPLETE:
            const { cellId, bundle} = action.payload
            state[cellId] = {
                loading: false,
                code: bundle.code,
                err: bundle.err
            }
            return state
        default:
            return state
    }
}, initialState)

export default bundlesReducer