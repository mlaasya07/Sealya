import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DatePickerProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateSelect,
  onClose,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(currentMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const selectDate = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (selectedDate >= tomorrow) {
      onDateSelect(selectedDate);
    }
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const quickOptions = [
    { label: 'Tomorrow', date: tomorrow },
    { label: 'Next Week', date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) },
    { label: 'Next Month', date: new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()) },
    { label: 'Next Year', date: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg border border-pink-200 dark:border-fuchsia-700 p-4 mt-2"
    >
      {/* Quick Options */}
      <div className="mb-4">
        <h4 className="text-sm font-mono text-pink-700 dark:text-fuchsia-300 mb-2">Quick Select</h4>
        <div className="grid grid-cols-2 gap-2">
          {quickOptions.map((option) => (
            <motion.button
              key={option.label}
              onClick={() => onDateSelect(option.date)}
              className="px-3 py-2 text-sm font-mono bg-pink-50 dark:bg-fuchsia-900/30 hover:bg-pink-100 dark:hover:bg-fuchsia-900/50 
                         text-pink-700 dark:text-fuchsia-300 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <motion.button
          onClick={() => navigateMonth('prev')}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-pink-100 dark:hover:bg-fuchsia-900/50 
                     text-pink-600 dark:text-fuchsia-400"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>

        <h3 className="font-mono text-pink-900 dark:text-fuchsia-100 font-semibold">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>

        <motion.button
          onClick={() => navigateMonth('next')}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-pink-100 dark:hover:bg-fuchsia-900/50 
                     text-pink-600 dark:text-fuchsia-400"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="text-center text-xs font-mono text-pink-600 dark:text-fuchsia-400 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="w-8 h-8" />
        ))}
        
        {days.map((day) => {
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const isToday = date.toDateString() === today.toDateString();
          const isPast = date < tomorrow;
          const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

          return (
            <motion.button
              key={day}
              onClick={() => selectDate(day)}
              disabled={isPast}
              className={`w-8 h-8 text-sm font-mono rounded-full transition-colors ${
                isPast
                  ? 'text-pink-300 dark:text-fuchsia-600 cursor-not-allowed'
                  : isSelected
                  ? 'bg-pink-600 dark:bg-fuchsia-600 text-white'
                  : isToday
                  ? 'bg-pink-100 dark:bg-fuchsia-900/50 text-pink-800 dark:text-fuchsia-200'
                  : 'hover:bg-pink-50 dark:hover:bg-fuchsia-900/30 text-pink-700 dark:text-fuchsia-300'
              }`}
              whileHover={!isPast ? { scale: 1.1 } : {}}
              whileTap={!isPast ? { scale: 0.9 } : {}}
            >
              {day}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-pink-100 dark:border-fuchsia-800 text-center">
        <button
          onClick={onClose}
          className="text-sm font-mono text-pink-600 dark:text-fuchsia-400 hover:text-pink-800 dark:hover:text-fuchsia-300"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
};