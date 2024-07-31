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

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const status = winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? "X" : "O"}`;

  return <>
    <div className="status">{status}</div>
    {[0, 1, 2].map((r) =>
      <div className="board-row">
        {[0, 1, 2].map((c) => {
          const i = c + 3 * r;
          return <Square value={squares[i]} onSquareClick={() => handleClick(i)} move={currentMove} />;
        })}
      </div>)}
    <div className="currentMove">You are at {currentMove > 0 ? `move #${currentMove}.` : 'the start.'}</div>
  </>;
}

function Square({ value, onSquareClick, move }) {
  return <button style={{ position: 'relative' }} className="square" onClick={onSquareClick}>
    {value}
    <div style={{ position: 'absolute', top: 0, left: '25%', color: 'grey' }}>
      {move}
    </div>
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
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] & squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

