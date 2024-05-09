import { useState } from 'react';

const snakeConfig = {
  dimensions: {
    x: 40,
    y: 30
  }
};

const Snake = () => {
  const [grid, setGrid] = useState(
    new Array(snakeConfig.dimensions.y).fill(new Array(snakeConfig.dimensions.x).fill(0))
  );

  return (
    <div className='container'>
      <h1>Snake</h1>
      <div className='w-full'>
        {grid.map(arry => (
          <div className='flex'>
            {arry.map(arrx => (
              <div className='m-[1px] h-[10px] w-[10px] bg-poimandres-darkslate'></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Snake;
