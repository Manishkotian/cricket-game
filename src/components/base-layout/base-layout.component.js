import React, { Component } from 'react'
import { connect } from "react-redux";
import { Button } from '@material-ui/core'

import { getRandomBall } from '../../helper'
import ScoreCard from '../score-card/score-card.component'

import './base-layout.component.css'

class BaseLayout extends Component {
  constructor (props) {
		super(props)
		this.state = {
			gameStart: false,
			strikePlayer: 0,
			nonStrikePlayer: 1,
			currentBowler: 0,
			currentBall: '',
			ballDone: 0,
			currentTeamIndex: 0,
			successMessage: ''
		}
	}

	updateBallScore = (ball) => {
		const { batsmanPlayers, ballerPlayers, totalResult } = this.props
		const { strikePlayer, nonStrikePlayer, currentBowler, currentTeamIndex, ballDone } = this.state
		const perOverBall = ballDone+1
		batsmanPlayers[strikePlayer].ballPlayed += 1
		totalResult[currentTeamIndex].ballPlayed += 1
		if(ball !== 0) {
			batsmanPlayers[strikePlayer].runScored +=  ball
			ballerPlayers[currentBowler].runGiven += ball
			totalResult[currentTeamIndex].score += ball
		}
		ballerPlayers[currentBowler].ballBowled += 1
		if(ball === 0) {
			ballerPlayers[currentBowler].zerosGiven += 1
		} else if(ball === 4) {
			batsmanPlayers[strikePlayer].fourHit += 1
			ballerPlayers[currentBowler].fourGiven += 1
		} else if(ball === 6) {
			batsmanPlayers[strikePlayer].sixHit += 1
			ballerPlayers[currentBowler].sixGiven += 1
		}
		this.props.updateScoreResult(batsmanPlayers, ballerPlayers)
		this.props.updateTotalResult(totalResult)
		if(perOverBall === 6) { // complete over done
			const currentBowlerIndexCalc = this.state.currentBowler%5
			this.setState({
				ballDone: 0,
				currentBowler: currentBowlerIndexCalc+1,
				strikePlayer: nonStrikePlayer,
				nonStrikePlayer: strikePlayer,
			})
		} else if (ball === 1 || ball === 3 || ball === 5) { // strike exchange done
			this.setState({
				ballDone: perOverBall,
				strikePlayer: nonStrikePlayer,
				nonStrikePlayer: strikePlayer,
			})
		} else {
			this.setState({
				ballDone: perOverBall
			})
		}
	}

	wideBall = () => {
		const { batsmanPlayers, ballerPlayers, totalResult } = this.props
		const { strikePlayer, currentBowler, currentTeamIndex } = this.state
		batsmanPlayers[strikePlayer].runScored += 1
		ballerPlayers[currentBowler].wide += 1
		this.props.updateScoreResult(batsmanPlayers, ballerPlayers)
		totalResult[currentTeamIndex].score += 1
		this.props.updateTotalResult(totalResult)
	}

	noBall = () => {
		const { batsmanPlayers, ballerPlayers, totalResult } = this.props
		const { strikePlayer, currentBowler, currentTeamIndex, ballDone} = this.state
		batsmanPlayers[strikePlayer].ballPlayed += 1
		batsmanPlayers[strikePlayer].runScored += 1
		ballerPlayers[currentBowler].noBall += 1
		this.props.updateScoreResult(batsmanPlayers, ballerPlayers)
		totalResult[currentTeamIndex].score += 1
		totalResult[currentTeamIndex].ballPlayed += 1
		this.props.updateTotalResult(totalResult)
		this.setState({
			ballDone: ballDone - 1
		})
	}

	outBall = (ball) => {
		const { batsmanPlayers, ballerPlayers, totalResult } = this.props
		const { strikePlayer, currentBowler, currentTeamIndex, ballDone } = this.state
		const perOverBall = ballDone+1
		batsmanPlayers[strikePlayer].ballPlayed += 1
		batsmanPlayers[strikePlayer].wicketBy = currentTeamIndex  === 0 ? `TB${currentBowler+1}` : `TA${currentBowler+1}`
		ballerPlayers[currentBowler].ballBowled  += 1 
		ballerPlayers[currentBowler].wicketTaken  += 1
		this.props.updateScoreResult(batsmanPlayers, ballerPlayers)
		totalResult[currentTeamIndex].wicketsGone += 1
		totalResult[currentTeamIndex].ballPlayed += 1
		this.props.updateTotalResult(totalResult)
		const currentBowlerIndexCalc = this.state.currentBowler%5
		this.setState({
			ballDone: perOverBall === 6 ? 0 : ballDone+1,
			currentBowler: perOverBall === 6 ? currentBowlerIndexCalc+1 : this.state.currentBowler,
			strikePlayer: strikePlayer+1,
		})
	}

	getBallValue = () => {
		const ball = getRandomBall()
		this.setState({
			currentBall: ball
		}, () => {
			if(ball === 7) {
				this.wideBall()
			} else if(ball === 8) {
				this.noBall()
			} else if(ball === 9) {
				this.outBall(ball)
			} else {
				this.updateBallScore(ball)
			}
		})
	}

	startGame = () => {
		this.setState({
			gameStart: true
		}, () => {
			this.currentInterval = setInterval(() => {
				this.getBallValue()
			}, 1000)
		})
	}

	stopGame = () => {
		this.setState({
			gameStart: false
		}, () => {
			clearInterval(this.currentInterval)
			this.setState({
				gameStart: false,
				strikePlayer: 0,
				nonStrikePlayer: 1,
				currentBowler: 0,
				currentBall: '',
				ballDone: 0,
				currentTeamIndex: 0,
				successMessage: ''
			})
			this.props.resetReducer()
		})
	}

	componentDidUpdate () {
		const { totalResult } = this.props
		const { currentTeamIndex, successMessage } = this.state
		if(currentTeamIndex === 0 && (totalResult[currentTeamIndex].wicketsGone === 10 || totalResult[currentTeamIndex].ballPlayed === 120)) {
			this.setState({
				currentTeamIndex: 1,
				strikePlayer: 0,
				nonStrikePlayer: 1,
				currentBowler: 0,
				currentBall: '',
				ballDone: 0,
				successMessage: ''
			})
			this.props.swapTeamPlayers()
		} else if(currentTeamIndex === 1)  {
			if(totalResult[currentTeamIndex].wicketsGone === 10 || totalResult[currentTeamIndex].ballPlayed === 120 || totalResult[1].score > totalResult[0].score){
				if(totalResult[0].score > totalResult[1].score) {
					clearInterval(this.currentInterval)
					if(!successMessage) {
						this.setState({ successMessage: 'TEAM A WON THE MATCH'})
					}
				} else {
					clearInterval(this.currentInterval)
					if(!successMessage) {
						this.setState({ successMessage: 'TEAM B WON THE MATCH'})
					}
				}
			}
		}
	}

	render () {
		const { gameStart, currentBall, currentTeamIndex, successMessage } = this.state
		const { batsmanPlayers, ballerPlayers, totalResult } = this.props
		return (
			<div className='base-layout'>
				<div className = 'header'>
					<Button onClick={() => gameStart ? this.stopGame() : this.startGame()} className='action-button'>
						{gameStart ? 'Stop' : 'Start' }
					</Button>
					<div className='ball'>
						<span>
							{!gameStart ? '' : currentBall === 7 ? 'Wide' : currentBall === 8 ? 'NB' : currentBall === 9 ? 'OUT' : currentBall}
						</span>
					</div>
				</div>
				<ScoreCard 
					batsmanPlayers={batsmanPlayers} 
					ballerPlayers={ballerPlayers}
					totalResult={totalResult}
					currentTeamIndex={currentTeamIndex}
					successMessage={successMessage}
				/>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		totalResult: state.totalResult,
		batsmanPlayers: state.batsmanPlayers,
		ballerPlayers: state.ballerPlayers
	};
}

function mapDispatchToProps(dispatch) {
	return {
		updateScoreResult: (batsman, bowler) => dispatch({type: 'UPDATE_SCORE_RESULT', payload: {batsman, bowler}}),
		updateTotalResult: (totalResult) => dispatch({type: 'UPDATE_TOTAL_RESULT', payload: totalResult}),
		resetReducer: () => dispatch({type: 'RESET_REDUCER'}),
		swapTeamPlayers: () => dispatch({type: 'SWAP_TEAM_PLAYERS'}),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(BaseLayout);