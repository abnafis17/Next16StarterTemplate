import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Option {
  label: string;
  value: string;
}

interface StageSelectProps {
  value: string;
  onChange: (value: string) => any;
  options: Option[];
  placeholder?: string;
  className?: string;
  disabled?: boolean; // 👈 new
}

const StageSelect: React.FC<StageSelectProps> = ({
  value,
  className = 'w-full',
  onChange,
  options,
  placeholder = 'Select Stage',
  disabled = false, // 👈 new
}) => {
  return (
    <div className="flex items-center gap-2">
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          className={`${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={disabled}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StageSelect;
