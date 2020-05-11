export const getPlayersInitialState = () => {
	let result = [];
	for(let i=0; i<11 ; i++) {
		let playerDetail = {
			runScored: 0,
			ballPlayed: 0,
			fourHit: 0,
			sixHit: 0,
			wicketBy: '',
			ballBowled: 0,
			runGiven: 0,
			wicketTaken: 0,
			zerosGiven: 0,
			fourGiven: 0,
			sixGiven: 0,
			wide: 0,
			noBall: 0
		}
		result.push(playerDetail)
	}
	return result
}

export const getTotalResult = () => {
	return [{
		wicketsGone: 0,
		score: 0,
		ballPlayed: 0,
		totalScore: 0
	},{
		wicketsGone: 0,
		score: 0,
		ballPlayed: 0,
		totalScore: 0
	}]
}

export const getRandomBall = () => {
	const value = Math.floor(Math.random() * 10);
	return value;
}

export const getOvers = (ball) => {
	const integerValue = ball/6
	const decimalValue = ball%6;
	return `${Math.floor(integerValue)}.${Math.floor(decimalValue)}`
}