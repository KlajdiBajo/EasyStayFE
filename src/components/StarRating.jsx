import { FaStar, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating = 4 }) => {
  return (
    <>
      {Array(5).fill('').map((_, index) =>
        rating > index ? (
          <FaStar key={index} className="text-yellow-400 w-4.5 h-4.5 inline-block" />
        ) : (
          <FaRegStar key={index} className="text-gray-300 w-4.5 h-4.5 inline-block" />
        )
      )}
    </>
  );
};

export default StarRating;
