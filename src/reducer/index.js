import { createStore } from 'redux'
import { getPlayersInitialState, getTotalResult } from '../helper'

const initialState = {
		totalResult: getTotalResult(),
		batsmanPlayers: getPlayersInitialState(),
		ballerPlayers: getPlayersInitialState()
}
const reducer = (state = initialState, action) => {
	switch(action.type) {
		case 'UPDATE_SCORE_RESULT': {
			return {
				...state,
				batsmanPlayers: [...action.payload.batsman],
				ballerPlayers: [...action.payload.bowler],
			}
		}
		case 'UPDATE_TOTAL_RESULT': {
			return {
				...state,
				totalResult: [...action.payload]			
			}
		}
		case 'SWAP_TEAM_PLAYERS': {
			return {
				...state,
				batsmanPlayers: [...state.ballerPlayers],
				ballerPlayers: [...state.batsmanPlayers],		
			}
		}
		case 'RESET_REDUCER': {
			return {
				...state,
				totalResult: getTotalResult(),
				batsmanPlayers: getPlayersInitialState(),
				ballerPlayers: getPlayersInitialState(),
			}
		}
		default:
			return state;
	}
};

export const store = createStore(reducer);

