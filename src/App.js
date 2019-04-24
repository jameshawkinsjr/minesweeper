import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './App.css'

const BOARD_SIZE = 10
const RESET_BUTTON_TEXT = 'New game'

class App extends Component {
  static propTypes = {
    boardRowsCount: PropTypes.number.isRequired,
    boardColsCount: PropTypes.number.isRequired,
  }

  static defaultProps = {
    boardRowsCount: BOARD_SIZE,
    boardColsCount: BOARD_SIZE,
  }

  state = {
    board: this.newBoard(),
    gameOver: false,
    gameWon: false,
  }

  render() {
    return (
      <div className="App">
        <div className="flex">
        {this.state.gameOver ? "😵" : this.state.gameWon ? "😎" : "🙂"}
        <button className="resetButton" onClick={this.resetBoard}>
          {RESET_BUTTON_TEXT}
        </button>
        {this.state.gameOver ? "😵" : this.state.gameWon ? "😎" : "🙂"}
        </div>
        <main className="board flex-column">
        { this.state.board.map((row, rowIdx) => <div key={rowIdx} className="row"> { row.map((cell) => ( this.renderCell(cell))) } </div> ) }
        </main>
      </div>
    )
  }

  renderCell(cell) {
    const initialContents = <span className="cellContents--initial" />
    const mineContents = (
      <span className={`cellContents--isMine ${cell.losingSquare ? "isLosingSquare" : ""}`} role="img" aria-label="mine">
        💣
      </span>
    )
    const flagContents = (
      <span className="cellContents--isFlag" role="img" aria-label="flag">
        📍
      </span>
    )
    const clearedContents = <span className={`a${cell.adjacentMinesCount} cellContents--isCleared`}>{cell.adjacentMinesCount || ""}</span>
    let cellContents = initialContents

    if (cell.isCleared) cellContents = clearedContents;
    if (cell.isCleared && cell.isMine) cellContents = mineContents;
    if (this.state.gameWon && cell.isMine) cellContents = flagContents;

    return <span 
                key={cell.pos}
                onClick= {() => { this.checkCell(cell); this.gameWon()} }
                className="cell">
                  {cellContents}
          </span>
  }

  checkCell(cell) {
    
    // Don't check cell if the cell has already been cleared
    if (cell.isCleared || this.state.gameOver || this.state.gameWon) return;
    // Game over if you click on a mine
    if (cell.isMine) return this.gameOver(cell)

    let row = cell.pos[0]
    let col = cell.pos[1]

    cell.adjacentMinesCount = this.adjacentMinesCount(cell);
    if (!cell.isMine) cell.isCleared = true;

    let newBoard = this.state.board
    newBoard[row][col] = cell;

    let adjacentCells = this.adjacentCells(cell);
    if (this.adjacentMinesCount(cell) === 0) {
      for (let i = 0; i < adjacentCells.length; i++) {
        let newCell = this.state.board[adjacentCells[i][0]][adjacentCells[i][1]];
        if (this.adjacentMinesCount(newCell) === 0 && !newCell.isCleared && !newCell.isMine) { 
          this.checkCell(newCell) 
        } else if (this.adjacentMinesCount(newCell) !== 0 && !newCell.isCleared && !newCell.isMine) {
          newCell.adjacentMinesCount = this.adjacentMinesCount(newCell);
          newCell.isCleared = true;
        }
      }
    }
    this.setState( { board: newBoard })
  }

  adjacentCells(cell) {
    let row = cell.pos[0];
    let col = cell.pos[1];
    let adjacentCells = [];

    if (row+1 < this.state.board.length) {
      adjacentCells.push([row + 1, col])

      if (col+1 < this.state.board.length){
        adjacentCells.push([row + 1, col+1])
      }

      if (col-1 >= 0){
        adjacentCells.push([row + 1, col - 1])
      }
    }

    if (row-1 >= 0) {
      adjacentCells.push([row - 1, col])

      if (col+1 < this.state.board.length){
        adjacentCells.push([row - 1, col + 1])
      }

      if (col-1 >= 0){
        adjacentCells.push([row - 1, col-1])
      }
    }

    if (col+1 < this.state.board.length) {
      adjacentCells.push([row, col + 1])
    }

    if (col-1 >= 0) {
      adjacentCells.push([row, col - 1])
    }

    return adjacentCells;
  }
  
  adjacentMinesCount(cell) {
    let numAdjacentMines = 0;
    let adjacentCells = this.adjacentCells(cell);
    adjacentCells.forEach( (cell) => {
      let row = cell[0];
      let col = cell[1];
      if ( row >= 0 && row < this.state.board.length && col >= 0 && col < this.state.board.length && this.state.board[cell[0]][cell[1]].isMine) numAdjacentMines++;
    })
    return numAdjacentMines;
  }
  
  gameOver(cell) {
    let row = cell.pos[0]
    let col = cell.pos[1]
    cell.losingSquare = true;
    cell.isCleared = true;
    let newBoard = this.state.board;
    newBoard[row][col] = cell;

    for (let i = 0; i < this.state.board.length; i++){
      for (let j = 0; j < this.state.board.length; j++){
        if (newBoard[i][j].isMine) newBoard[i][j].isCleared = true;
      }
    }
    this.setState( { gameOver: true, board: newBoard } )
  }

  gameWon() {
    for (let i = 0; i < this.state.board.length; i++){
      for (let j = 0; j < this.state.board.length; j++){
        if (!this.state.board[i][j].isCleared && !this.state.board[i][j].isMine) return false;
      }
    }
    this.setState({ gameWon: true })
  }

  newBoard() {
    const { boardRowsCount, boardColsCount } = this.props

    const newBoard = []

    for (let r = 0; r < boardRowsCount; r++) {
      const row = []
      for (let c = 0; c < boardColsCount; c++) {
        const cell = {
          isMine: Math.floor(Math.random() * 8) === 0,
          isCleared: false,
          pos: [r,c],
          adjacentMinesCount: 0,
        }
        row.push(cell)
      }
      newBoard.push(row)
    }

    return newBoard
  }

  resetBoard = () => {
    this.setState({ board: this.newBoard(), gameOver: false, gameWon: false })
  }
}

export default App
