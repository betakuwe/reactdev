import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  const moves = history.map((_squares, move) =>
    <li key={move}>
      <button onClick={() => setCurrentMove(move)}>
        {move > 0 ? `Go to move #${move}` : 'Go to game start'}
      </button>
    </li>);

  return <div className="game">
    <div className="game-board">
      <Board currentMove={currentMove} squares={currentSquares} onPlay={handlePlay} />
    </div>
    <div className="game-info">
      <ol>{moves}</ol>
    </div>
  </div>;
}

function Board({ currentMove, squares, onPlay }) {
  const xIsNext = currentMove % 2 === 0;
  const lineIfWin = calculateWinner(squares);

  function handleClick(i) {
    console.log(lineIfWin);
    if (squares[i] !== null || lineIfWin !== null) return;
    const nextSquares = squares.slice();
    nextSquares[i] = currentMove;
    onPlay(nextSquares);
  }

  const [showOrder, setShowOrder] = useState(false);
  const noMoreMoves = currentMove >= 9;
  const winner = lineIfWin === null ? null : currentMove % 2 === 1 ? 'X' : 'O';
  const status = lineIfWin !== null ?
    `Winner: ${winner}` :
    noMoreMoves ?
      `Draw` :
      `Next player: ${xIsNext ? "X" : "O"}`;

  return <>
    <div className="status">{status}</div>
    {[...Array(3).keys()].map((r) =>
      <div key={r} className="board-row">
        {[...Array(3).keys()].map((c) => {
          const i = c + 3 * r;
          return <Square key={i} moveNumber={squares[i]} onSquareClick={() => handleClick(i)} showOrder={showOrder} />;
        })}
      </div>)}
    <div className="currentMove">You are at {currentMove > 0 ? `move #${currentMove}.` : 'the start.'}</div>
    <button onClick={() => setShowOrder(!showOrder)}>Toggle show order</button>
  </>;
}

function Square({ moveNumber, onSquareClick, showOrder }) {
  return <button style={{ position: 'relative' }} className="square" onClick={onSquareClick}>
    {moveNumber === null ? null : moveNumber % 2 === 0 ? 'X' : 'O'}
    {showOrder ||
      <div style={{ position: 'absolute', top: 0, left: '25%', color: 'red' }}>
        {moveNumber}
      </div>
    }
  </button>;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [x, y, z] = lines[i]?.map((i) => squares[i] === null ? null : squares[i] % 2)
    if (x !== null && x === y && x === z) {
      return lines[i];
    }
  }
  return null;
}

