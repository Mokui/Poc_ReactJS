import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
      <button className="square" onClick={props.onClick}>
          {props.value}
      </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>;
  }

  createMatrix(rowCount, colCount){
    let myarr = [];
    let cpt = 0;
    for(let i=0; i < rowCount; i++){
      let row = [];
      for(let j=0; j < colCount; j++){
        let col = cpt;
        row.push(col);
        cpt++;
      }
      myarr.push(row);
    }
    return myarr;
  }

  render() {
    const board = this.createMatrix(3,3);

    return (<div>
      {board.map((row, i) => (
        <div key={i} className="board-row">
          {row.map((col, j) => (
            <span key={j}>{this.renderSquare(col)}</span>
          ))}
        </div>
      ))}
    </div>);
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      nextNumber: 0,
      isTurnX: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.nextNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.isTurnX ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares, 
      }]),
      nextNumber: history.length,
      isTurnX: !this.state.isTurnX
    });
  }

  jumpTo(step) {
    this.setState({
      nextNumber: step,
      isTurnX: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.nextNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step,move) => {
      const desc = move ? 
        'Revenir au tour n°'+ move :
        'Recommencer';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if(winner) { 
      status = winner + ' a gagné';
    } else {
      status = "Prochain joueur: "+ (this.state.isTurnX ? 'X' : 'O');      
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}