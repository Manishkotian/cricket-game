import React from 'react'
import { TableContainer, Table, TableBody, TableCell, Paper, TableRow, TableHead } from '@material-ui/core'
import { getOvers } from '../../helper'

import './score-card.component.css'

function ScoreCard(props) {
	const { batsmanPlayers, ballerPlayers, totalResult, currentTeamIndex, successMessage } = props

	const getStrikeRate = (run, ball) => {
		const sr = (run*100)/ball
		if(sr) {
			return sr.toFixed(2)
		} else {
			return 0
		}
	}

	const getEconomy = (run, ball) => {
		const economy =  run/ball
		if(economy) {
			return economy.toFixed(2)
		} else {
			return 0
		}
	}

	const renderBatsmanTable = () => {
		return (
			<TableContainer component={Paper} className='batsman-table'>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell align='left'>Batsman Name</TableCell>
							<TableCell align="left">Runs</TableCell>
							<TableCell align="left">Bowls</TableCell>
							<TableCell align="left">4s</TableCell>
							<TableCell align="left">6s</TableCell>
							<TableCell align="left">Wicket By</TableCell>
							<TableCell align="left">SR</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{batsmanPlayers.map((row, index) => (
							<TableRow key={index}>
								<TableCell align="left">{currentTeamIndex === 0  ? 	`TA${index+1}` : `TB${index+1}`}</TableCell>
								<TableCell align="left">{row.runScored}</TableCell>
								<TableCell align="left">{row.ballPlayed}</TableCell>
								<TableCell align="left">{row.fourHit}</TableCell>
								<TableCell align="left">{row.sixHit}</TableCell>
								<TableCell align="left">{row.wicketBy ? row.wicketBy : '-'}</TableCell>
								<TableCell align="left">{getStrikeRate(row.runScored,row.ballPlayed)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		)
	}

	const renderBowlerTable = () => {
		return (
			<TableContainer component={Paper} className='bowler-table'>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell align="left">Bowler Name</TableCell>
							<TableCell align="left">Overs</TableCell>
							<TableCell align="left">Runs</TableCell>
							<TableCell align="left">Wickets</TableCell>
							<TableCell align="left">Econ</TableCell>
							<TableCell align="left">0s</TableCell>
							<TableCell align="left">4s</TableCell>
							<TableCell align="left">6s</TableCell>
							<TableCell align="left">WD</TableCell>
							<TableCell align="left">NB</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{ballerPlayers.map((row, index) => (
							<TableRow key={index}>
								<TableCell align="left">{currentTeamIndex === 0  ? 	`TB${index+1}` : `TA${index+1}`}</TableCell>
								<TableCell align="left">{getOvers(row.ballBowled)}</TableCell>
								<TableCell align="left">{row.runGiven}</TableCell>
								<TableCell align="left">{row.wicketTaken}</TableCell>
								<TableCell align="left">{getEconomy(row.runGiven,row.ballBowled )}</TableCell>
								<TableCell align="left">{row.zerosGiven}</TableCell>
								<TableCell align="left">{row.fourGiven}</TableCell>
								<TableCell align="left">{row.sixGiven}</TableCell>
								<TableCell align="left">{row.wide}</TableCell>
								<TableCell align="left">{row.noBall}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		)
	}

	const renderScoreView = () => {
		return (
			<div className='score-view'>
					{totalResult.map((details, index) => (
						<div className='teams' key={index}>
							<div className='team-name'>
								{index === 0 ? 'Team A :' : 'Team B :'}
							</div>
							<div className='score-details'>
								<span>{`${details.score}/${details.wicketsGone} (R/R), `}</span>
								<span>{`Overs ${getOvers(details.ballPlayed)}`}</span>
							</div>
					</div>
					))}
					{successMessage ? <p className='success-message'>{successMessage}</p> : null}
			</div>
		)
	}

  return (
		<div className='score-card'>
			<p className='score-title'>Score card with all the details</p>
			<p className='score-title'>Score card:</p>
			{totalResult && totalResult.length ? renderScoreView() : null}
			<div className='score-table'>
				{batsmanPlayers && batsmanPlayers.length ? renderBatsmanTable() : null}
				{ballerPlayers && ballerPlayers.length ? renderBowlerTable() : null}
			</div>
		</div>
	)
}

export default ScoreCard;