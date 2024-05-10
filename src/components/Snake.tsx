import { useReducer, useEffect, useState, useCallback } from 'react';
import { useInterval } from 'usehooks-ts';
import { IoIosArrowUp, IoIosArrowDown, IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

type Action =
  | { type: 'up' }
  | { type: 'down' }
  | { type: 'left' }
  | { type: 'right' }
  | { type: 'reset' };

interface SnakeConfig {
  dimensions: { x: number; y: number };
  speed: number;
  initialSnake: number[][];
}

const snakeConfig: SnakeConfig = {
  dimensions: {
    x: 31,
    y: 20
  },
  speed: 60,
  get initialSnake() {
    return [
      [Math.floor(this.dimensions.x / 2), Math.floor(this.dimensions.y / 2)],
      [Math.floor(this.dimensions.x / 2), Math.floor(this.dimensions.y / 2) + 1],
      [Math.floor(this.dimensions.x / 2), Math.floor(this.dimensions.y / 2) + 2]
    ];
  }
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
    case 'reset':
      return [...snakeConfig.initialSnake];
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
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [newHighScore, setNewHighScore] = useState(false);
  const [food, setFood] = useState<number[]>([]);
  const [specialFood, setSpecialFood] = useState<number[]>([]);
  const [direction, directionDispatch] = useReducer(directionReducer, 'up');
  const [snake, snakeDispatch] = useReducer(snakeReducer, snakeConfig.initialSnake);
  const [tail, setTail] = useState<number[]>([]);

  const addRandomFood = (type: 'normal' | 'special'): void => {
    const foodCoords = getRandomCoords();

    for (const segment of snake) {
      if (segment[0] === foodCoords[0] && segment[1] === foodCoords[1]) {
        return addRandomFood(type);
      }
    }

    switch (type) {
      case 'normal':
        setFood(foodCoords);
        break;
      case 'special':
        setSpecialFood(foodCoords);
        break;
    }
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
      // Lengthen snake
      if (tail.length) {
        snake.push(tail);
        setTail([]);
      }
      // Consume food and update score
      if (snake[0][0] === food[0] && snake[0][1] === food[1]) {
        setFood([]);
        setScore(score + 10);
        setTail(snake[snake.length - 1]);
      }
      if (snake[0][0] === specialFood[0] && snake[0][1] === specialFood[1]) {
        setSpecialFood([]);
        setScore(score + 50);
        setTail(snake[snake.length - 1]);
      }
      // Randomly add food to grid
      if (!food.length && Math.floor(Math.random() * 100) < 5) {
        addRandomFood('normal');
      }
      if (!specialFood.length && Math.floor(Math.random() * 100) < 0.5) {
        addRandomFood('special');
      }
      // Randomly remove special food
      if (specialFood.length && Math.floor(Math.random() * 100) < 2) {
        setSpecialFood([]);
      }
      // Fail state when snake collides with itself
      for (let i = 1; i < snake.length; i++) {
        if (snake[0][0] === snake[i][0] && snake[0][1] === snake[i][1]) {
          setIsPlaying(false);
          setGameOver(true);
          const highScore = localStorage.getItem('highScore');
          if (!highScore || score > Number(highScore)) {
            setNewHighScore(true);
            localStorage.setItem('highScore', score.toString());
          } else {
            setNewHighScore(false);
          }
        }
      }
    },
    isPlaying ? snakeConfig.speed : null
  );

  const handleGameState = useCallback(() => {
    if (gameOver) {
      setGameOver(false);
      setScore(0);
      setFood([]);
      setSpecialFood([]);
      snakeDispatch({ type: 'reset' });
      directionDispatch({ type: 'up' });
    } else {
      setIsPlaying(!isPlaying);
    }
  }, [gameOver, isPlaying]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.code === 'ArrowUp' ||
        e.code === 'KeyW' ||
        e.code === 'ArrowDown' ||
        e.code === 'KeyS' ||
        e.code === 'ArrowLeft' ||
        e.code === 'KeyA' ||
        e.code === 'ArrowRight' ||
        e.code === 'KeyD' ||
        e.code === 'Space'
      ) {
        e.preventDefault();
      }
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          if (direction !== 'down') {
            return directionDispatch({ type: 'up' });
          }
          break;
        case 'ArrowDown':
        case 'KeyS':
          if (direction !== 'up') {
            return directionDispatch({ type: 'down' });
          }
          break;
        case 'ArrowLeft':
        case 'KeyA':
          if (direction !== 'right') {
            return directionDispatch({ type: 'left' });
          }
          break;
        case 'ArrowRight':
        case 'KeyD':
          if (direction !== 'left') {
            return directionDispatch({ type: 'right' });
          }
          break;
        case 'Space':
          handleGameState();
      }
    },
    [direction, handleGameState]
  );

  useEffect(() => {
    document.body.addEventListener('keydown', handleKeyDown);
    setHighScore(Number(localStorage.getItem('highScore')));
    return () => document.body.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleDPad = (dPadDirection: 'up' | 'down' | 'left' | 'right') => {
    switch (dPadDirection) {
      case 'up':
        if (direction !== 'down') {
          return directionDispatch({ type: 'up' });
        }
        break;
      case 'down':
        if (direction !== 'up') {
          return directionDispatch({ type: 'down' });
        }
        break;
      case 'left':
        if (direction !== 'right') {
          return directionDispatch({ type: 'left' });
        }
        break;
      case 'right':
        if (direction !== 'left') {
          return directionDispatch({ type: 'right' });
        }
        break;
    }
  };

  return (
    <div className='container'>
      <header className='mb-2 flex'>
        <h1 className='mr-4 text-4xl'>🐍 Snake</h1>
        <h1 className='ml-auto text-4xl text-poimandres-yellow'>
          {score} <span className='text-poimandres-darkslate'>/{highScore}</span>
        </h1>
      </header>
      <div className='relative w-full'>
        {gameOver && (
          <div className='absolute flex h-full w-full flex-col items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm'>
            <h2 className='text-5xl text-poimandres-darkpink'>GAME OVER</h2>
            <h3 className='text-3xl text-poimandres-lighterblue'>Score: {score}</h3>
            {newHighScore && (
              <h3 className='text-3xl text-poimandres-lightgreen'>NEW HIGH SCORE!!!</h3>
            )}
          </div>
        )}
        {grid.map((arry: number[], y: number) => (
          <div className='flex' key={`row${y}`}>
            {arry.map((_arrx: number, x: number) => {
              for (const coord of snake) {
                // Snake cell
                if (coord[0] === x && coord[1] === y) {
                  return (
                    <div
                      className='m-[1px] h-[10px] w-[10px] rounded-sm bg-poimandres-lightgreen'
                      key={`${x}${y}`}
                    ></div>
                  );
                }
              }
              // Food cell
              if (food.length && food[0] === x && food[1] === y) {
                return (
                  <div
                    className='m-[1px] h-[10px] w-[10px] rounded  bg-poimandres-lightpink'
                    key={`${x}${y}`}
                  ></div>
                );
              }
              //Special food cell
              if (specialFood.length && specialFood[0] === x && specialFood[1] === y) {
                return (
                  <div
                    className='m-[1px] h-[10px] w-[10px] rotate-45 bg-poimandres-yellow'
                    key={`${x}${y}`}
                  ></div>
                );
              }
              // Empty cell
              return (
                <div
                  className='m-[1px] h-[10px] w-[10px] rounded-sm bg-poimandres-blackslate'
                  key={`${x}${y}`}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
      <button
        className='mt-2 w-full rounded bg-poimandres-darkerblue py-2 text-2xl uppercase text-poimandres-lighterblue shadow-lg outline-none hover:bg-poimandres-darkblue hover:[text-shadow:_4px_4px_0_#F087BD,_-4px_-4px_0_#5DE4C7]'
        onClick={handleGameState}
      >
        {isPlaying ? 'Pause' : gameOver ? 'Reset' : 'Start'}
      </button>
      <div className='mt-10'>
        <div className='flex h-14 justify-center'>
          <button
            className='flex w-14 items-center justify-center rounded-t-lg border-x border-t border-poimandres-darkblue bg-poimandres-blackslate active:bg-poimandres-darkslate '
            onClick={() => handleDPad('up')}
          >
            <IoIosArrowUp />
          </button>
        </div>
        <div className='flex h-14 justify-center'>
          <button
            className='b-poimandeas-white flex w-14 items-center justify-center rounded-l-lg border-y border-l border-poimandres-darkblue bg-poimandres-blackslate active:bg-poimandres-darkslate'
            onClick={() => handleDPad('left')}
          >
            <IoIosArrowBack />
          </button>
          <div className='w-14 bg-poimandres-blackslate'></div>
          <button
            className='flex w-14 items-center justify-center rounded-r-lg border-y border-r border-poimandres-darkblue bg-poimandres-blackslate active:bg-poimandres-darkslate '
            onClick={() => handleDPad('right')}
            id='right'
          >
            <IoIosArrowForward />
          </button>
        </div>
        <div className='flex h-14 justify-center'>
          <button
            className='flex w-14 items-center justify-center rounded-b-lg border-x border-b border-poimandres-darkblue bg-poimandres-blackslate active:bg-poimandres-darkslate'
            onClick={() => handleDPad('down')}
          >
            <IoIosArrowDown />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Snake;
