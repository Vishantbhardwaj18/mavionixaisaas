import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface Props {
  isListening: boolean;
  isProcessing: boolean;
  onClick: () => void;
}

const VoiceOrb: React.FC<Props> = ({ isListening, isProcessing, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative z-50 flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 shadow-2xl ${
        isProcessing 
          ? 'bg-amber-400 scale-95' 
          : isListening 
            ? 'bg-rose-500 scale-110' 
            : 'bg-indigo-600 hover:bg-indigo-700'
      }`}
    >
      {/* Ripple effects when listening */}
      {isListening && (
        <>
          <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping"></span>
          <span className="absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-20 animate-pulse delay-75 scale-125"></span>
        </>
      )}

      {/* Processing spinner ring */}
      {isProcessing && (
         <div className="absolute w-24 h-24 rounded-full border-4 border-amber-300 border-t-transparent animate-spin"></div>
      )}

      <div className="relative z-10 text-white">
        {isListening ? (
          <Mic className="w-8 h-8 animate-bounce" />
        ) : isProcessing ? (
          <div className="w-8 h-8 flex items-center justify-center font-bold text-lg">...</div>
        ) : (
          <Mic className="w-8 h-8" />
        )}
      </div>
    </button>
  );
};

export default VoiceOrb;