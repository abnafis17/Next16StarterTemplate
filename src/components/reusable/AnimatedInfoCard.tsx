import { motion } from 'framer-motion';
import { Card } from '../ui/card';

interface AnimatedInfoCardProps {
  title: string;
  description: string;
  icon: any;
}

const AnimatedInfoCard: React.FC<AnimatedInfoCardProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Start with hidden and lower position
      animate={{ opacity: 1, y: 0 }} // Fade in and move to the original position
      exit={{ opacity: 0, y: 50 }} // Fade out and move down
      transition={{ duration: 0.5 }}
    >
      <Card className='p-4 rounded-lg shadow-lg bg-white flex items-center space-x-4'>
        <div className='text-2xl'>{icon}</div> {/* Display the passed icon */}
        <div className='flex flex-col'>
          <h2 className='text-xl font-semibold text-gray-800'>{title}</h2>{' '}
          {/* Title styling */}
          <p className='text-sm text-gray-600'>{description}</p>{' '}
          {/* Description styling */}
        </div>
      </Card>
    </motion.div>
  );
};

export default AnimatedInfoCard;
