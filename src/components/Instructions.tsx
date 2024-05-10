import { IoMdClose } from 'react-icons/io';
import { MdOutlineSpaceBar } from 'react-icons/md';

interface InstructionsProps {
  onCloseInstructions: () => void;
  foodValue: number;
  specialFoodValue: number;
}

const Instructions = ({ onCloseInstructions, foodValue, specialFoodValue }: InstructionsProps) => {
  return (
    <div className='absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm'>
      <div className='flex h-full w-full flex-col items-center justify-center'>
        <button onClick={onCloseInstructions}>
          <IoMdClose className='absolute right-2 top-2 h-16 w-16 text-poimandres-darkpink' />
        </button>
        <div className='align-center container flex flex-col items-center justify-center px-4'>
          <h1 className='mb-2 text-center text-2xl text-poimandres-yellow'>How to play</h1>
          <p className='text-center'>
            Start the game by clicking 'Start', or by pressing
            <MdOutlineSpaceBar className='ml-2 inline-block' />
          </p>
          <p className='text-center'>
            Move the snake using the D-Pad, or by using the arrow keys or WASD
          </p>
          <p className='text-center'>
            Eat the <span className='ml-1 text-poimandres-lightpink'>food</span>
            <div className='mx-2 inline-block h-[10px] w-[10px] rounded  bg-poimandres-lightpink'></div>{' '}
            to score {foodValue} points
          </p>
          <p className='text-center'>
            Eat the <span className='ml-1 text-poimandres-yellow'>special food</span>
            <div className='mx-2 inline-block h-[10px] w-[10px] rotate-45 bg-poimandres-yellow'></div>
            to score {specialFoodValue} points
          </p>
          <p className='text-center'>
            When you eat food the length of your snake will increase by 1
          </p>
          <p className='text-center'>The game ends when you collide with your tail.</p>
          <p className='mt-2 text-center text-2xl text-poimandres-lightgreen'>GOOD LUCK!</p>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
