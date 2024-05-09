import { useState } from 'react';

const snakeConfig = {
  dimensions: {
    x: 30,
    y: 25
  }
};

const Snake = () => {
  const [grid, setGrid] = useState(
    new Array(snakeConfig.dimensions.y).fill(new Array(snakeConfig.dimensions.x).fill(0))
  );
  const [snake, setSnake] = useState([
    [2, 2],
    [2, 3],
    [2, 4]
  ]);

  return (
    <div className='container'>
      <h1>Snake</h1>
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
