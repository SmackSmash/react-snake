import { useReducer, useEffect, useState, useCallback, type KeyboardEvent } from 'react';
import { useInterval } from 'usehooks-ts';

type Action = { type: 'up' } | { type: 'down' } | { type: 'left' } | { type: 'right' };

const snakeConfig = {
  dimensions: {
    x: 50,
    y: 30
  },
  speed: 100
};

const snakeReducer = (state: Array<number[]>, action: Action): Array<number[]> => {
  switch (action.type) {
    case 'up':
      if (state[0][1] === 0) {
        return [[state[0][0], snakeConfig.dimensions.y - 1], ...state.slice(0, state.length - 1)];
      }
      return [[state[0][0], state[0][1] - 1], ...state.slice(0, state.length - 1)];
    case 'down':
      if (state[0][1] === snakeConfig.dimensions.y - 1) {
        return [[state[0][0], 0], ...state.slice(0, state.length - 1)];
      }
      return [[state[0][0], state[0][1] + 1], ...state.slice(0, state.length - 1)];
    case 'left':
      if (state[0][0] === 0) {
        return [[snakeConfig.dimensions.x - 1, state[0][1]], ...state.slice(0, state.length - 1)];
      }
      return [[state[0][0] - 1, state[0][1]], ...state.slice(0, state.length - 1)];
    case 'right':
      if (state[0][0] === snakeConfig.dimensions.x - 1) {
        return [[0, state[0][1]], ...state.slice(0, state.length - 1)];
      }
      return [[state[0][0] + 1, state[0][1]], ...state.slice(0, state.length - 1)];
    default:
      return state;
  }
};

const directionReducer = (state: string, action: Action): string => {
  switch (action.type) {
    case 'up':
      return 'up';
    case 'down':
      return 'down';
    case 'left':
      return 'left';
    case 'right':
      return 'right';
    default:
      return state;
  }
};

const Snake = () => {
  const grid = new Array(snakeConfig.dimensions.y).fill(
    new Array(snakeConfig.dimensions.x).fill(0)
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [direction, directionDispatch] = useReducer(directionReducer, 'right');
  const [snake, snakeDispatch] = useReducer(snakeReducer, [
    [2, 2],
    [2, 3],
    [2, 4]
  ]);

  useInterval(
    () => {
      switch (direction) {
        case 'up':
          return snakeDispatch({ type: 'up' });
        case 'down':
          return snakeDispatch({ type: 'down' });
        case 'left':
          return snakeDispatch({ type: 'left' });
        case 'right':
          return snakeDispatch({ type: 'right' });
      }
    },
    isPlaying ? snakeConfig.speed : null
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (
      e.code === 'ArrowUp' ||
      e.code === 'ArrowDown' ||
      e.code === 'ArrowLeft' ||
      e.code === 'ArrowRight'
    ) {
      e.preventDefault();
    }
    switch (e.code) {
      case 'ArrowUp':
        return directionDispatch({ type: 'up' });
      case 'ArrowDown':
        return directionDispatch({ type: 'down' });
      case 'ArrowLeft':
        return directionDispatch({ type: 'left' });
      case 'ArrowRight':
        return directionDispatch({ type: 'right' });
    }
  }, []);

  useEffect(() => {
    document.body.addEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleStart = () => {
    setIsPlaying(true);
  };

  return (
    <div className='container'>
      <h1>Snake</h1>
      <h1>{direction}</h1>
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
