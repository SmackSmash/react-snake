import { useState, useReducer } from 'react';

type Action = { type: 'down' };

const snakeConfig = {
  dimensions: {
    x: 30,
    y: 30
  }
};

const snakeReducer = (state: any, action: Action) => {
  switch (action.type) {
    case 'down':
      return state.map((coord: number[]) => [coord[0], coord[1] + 1]);
    default:
      return state;
  }
};

const Snake = () => {
  const [grid, setGrid] = useState(
    new Array(snakeConfig.dimensions.y).fill(new Array(snakeConfig.dimensions.x).fill(0))
  );
  const [direction, setDirection] = useState('down');
  const [snake, dispatch] = useReducer(snakeReducer, [
    [2, 2],
    [2, 3],
    [2, 4]
  ]);

  const handleStart = () => {
    setInterval(() => {
      switch (direction) {
        case 'down':
        default:
          dispatch({ type: 'down' });
      }
    }, 250);
  };

  return (
    <div className='container'>
      <h1>Snake</h1>
      <button onClick={handleStart}>Start</button>
      <div className='w-full'>
        {grid.map((arry: number[], y: number) => (
          <div className='flex' key={`row${y}`}>
            {arry.map((_arrx: number, x: number) => {
              for (const coord of snake) {
                if (coord[0] === x && coord[1] === y) {
                  return (
                    <div
                      className='m-[1px] h-[10px] w-[10px] bg-poimandres-lightgreen'
                      key={`${x}${y}`}
                    ></div>
                  );
                }
              }
              return (
                <div
                  className='m-[1px] h-[10px] w-[10px] bg-poimandres-blackslate'
                  key={`${x}${y}`}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Snake;
