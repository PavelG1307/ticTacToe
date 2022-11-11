const value = [ null, null, null, null, null, null, null, null, null ]

let player = 'X'
const players = ['X', 'O']
let weightSteps = []

const winCombs = {
    0: [
        [ 1, 2 ],
        [ 3, 6 ],
        [ 4, 8 ]
    ],
    1: [
        [ 4, 7 ]
    ],
    2: [
        [ 5, 8 ],
        [ 4, 6 ]
    ],
    3: [ 
        [4, 5]
    ],
    6: [
        [7, 8]
    ]
}

const message = document.querySelector('.message')
const cells = document.getElementsByClassName('cell')
for (i in cells) {
    cells[i].addEventListener('click', (event) => {
        const id = event.target.id
        const index = Number(id.split('_')[1])
        if (event.target.innerText) return
        value[index] = players.indexOf(player)
        document.getElementById(id).innerText = player
        const status = checkValue(value)
        if (!status) {
            changePlayer(player)
            move()
            return
        }
        if (status === 'WIN_0') {
            setMessage(`Выиграл X`)
        }
        if (status === 'WIN_1') {
            setMessage(`Выиграл O`)
        }
        if (status === 'DRAW') {
            setMessage(`Ничья`)
        }
    })
}

function changePlayer() {
    if (player === 'X') player = 'O'
    else player = 'X'
    setMessage(`Ход: ${player}`)
}

function setMessage(text) {
    message.innerText = text
}

function checkValue(values) {
    let draw = true
    for (let i = 0; i < values.length; i++){
        const target = values[i]
        if (target === null) {
            draw = false
            continue
        }
        for (const j in winCombs[i]) {
            const comb = winCombs[i][j]
            if (values[comb[0]] === target && values[comb[1]] === target) {
                return 'WIN_' + target
            }
        }
    }
    if (draw) return 'DRAW'
}

function move() {
    // const index = Math.floor(Math.random() * 8)
    weightSteps = []
    const index = getIndex(value, 0, players.indexOf(player), player)
    // if (value[index] !== null) return move()
    value[index] = players.indexOf(player)
    document.getElementById(`cel_${index}`).innerText = player
    const status = checkValue(value)
    if (!status) {
        changePlayer(player)
        return
    }
    if (status === 'WIN_0') {
        setMessage(`Выиграл X`)
    }
    if (status === 'WIN_1') {
        setMessage(`Выиграл O`)
    }
    if (status === 'DRAW') {
        setMessage(`Ничья`)
    }

}

function getIndex(values, depth, targetPlayer, playerMove) {
    // if (depth > 5) return
    // console.log(depth)
    for (let i = 0; i < values.length; i++) {
        if (values[i] !== null) continue
        if (depth === 0) {
            weightSteps.push({ value: i, weight: 0, stepsWin: 100,  stepsFail: 100,})
        }
        const status = checkValue(values)
        if (status === 'WIN_' + targetPlayer) {
            weightSteps.at(-1).weight += 10 - depth
            if (weightSteps.at(-1).stepsWin > depth) {
                weightSteps.at(-1).stepsWin = depth
            }
        } else if (status && status.includes('WIN_')) {
            weightSteps.at(-1).weight -= 10 - depth
            if (weightSteps.at(-1).stepsFail > depth) {
                weightSteps.at(-1).stepsFail = depth
            }
        }
        const newValues = JSON.parse(JSON.stringify(values))
        newValues[i] = players.indexOf(playerMove)
        const newDepth = depth + 1
        const newPlayerMove = playerMove === 'X' ? 'O' : 'X'
        getIndex(newValues, newDepth, targetPlayer, newPlayerMove)
    }
    if (depth === 0) {
        console.log(weightSteps)
        // for (const i in weightSteps) {
        //     if (weightSteps[i].stepsWin <= 2) return weightSteps[i].value
        // }
        weightSteps = weightSteps.sort((a, b) => a.stepsFail < b.stepsFail ? 1 : -1)
        console.log(weightSteps[0].value)
        return weightSteps[0].value
    }
}