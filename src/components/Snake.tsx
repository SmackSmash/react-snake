import { useReducer, useEffect, useState, useCallback } from 'react';
import { useInterval } from 'usehooks-ts';

type Action = { type: 'up' } | { type: 'down' } | { type: 'left' } | { type: 'right' };

const snakeConfig = {
  dimensions: {
    x: 50,
    y: 30
  },
  speed: 60
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

const getRandomCoords = (): [number, number] => {
  return [
    Math.floor(Math.random() * (snakeConfig.dimensions.x - 1)),
    Math.floor(Math.random() * (snakeConfig.dimensions.y - 1))
  ];
};

const Snake = () => {
  const grid = new Array(snakeConfig.dimensions.y).fill(
    new Array(snakeConfig.dimensions.x).fill(0)
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [food, setFood] = useState<number[]>([]);
  const [direction, directionDispatch] = useReducer(directionReducer, 'right');
  const [snake, snakeDispatch] = useReducer(snakeReducer, [
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [2, 7],
    [2, 8],
    [2, 9],
    [2, 10],
    [2, 11],
    [2, 12],
    [2, 13],
    [2, 14]
  ]);

  const addRandomFood = (): void => {
    const foodCoords = getRandomCoords();
    for (const segment of snake) {
      if (segment[0] === foodCoords[0] && segment[1] === foodCoords[1]) {
        return addRandomFood();
      }
    }
    setFood(foodCoords);
  };

  useInterval(
    () => {
      // Move snake in set direction
      switch (direction) {
        case 'up':
          snakeDispatch({ type: 'up' });
          break;
        case 'down':
          snakeDispatch({ type: 'down' });
          break;
        case 'left':
          snakeDispatch({ type: 'left' });
          break;
        case 'right':
          snakeDispatch({ type: 'right' });
          break;
      }
      // Consume foor and update score
      if (snake[0][0] === food[0] && snake[0][1] === food[1]) {
        setFood([]);
        setScore(score + 10);
      }
      // Randomly add food to grid
      if (!food.length && Math.floor(Math.random() * 100) < 5) {
        addRandomFood();
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
      <header className='flex'>
        <h1 className='mr-4 text-2xl'>Snake</h1>
        <h1 className='mr-4'>{direction}</h1>
        <button className='ml-auto' onClick={handleStart}>
          Start
        </button>
        <h1 className='ml-6 text-2xl'>{score}</h1>
      </header>
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
              if (food.length && food[0] === x && food[1] === y) {
                return (
                  <div
                    className='m-[1px] h-[10px] w-[10px] bg-poimandres-lightpink'
                    key={`${x}${y}`}
                  ></div>
                );
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
