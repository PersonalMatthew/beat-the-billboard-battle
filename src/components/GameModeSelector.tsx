
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface GameModeSelectorProps {
  onSelectMode: (mode: "daily" | "streak") => void;
}

const GameModeSelector = ({ onSelectMode }: GameModeSelectorProps) => {
  const [selectedMode, setSelectedMode] = useState<"daily" | "streak">("streak");

  const handleModeSelection = () => {
    onSelectMode(selectedMode);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6 bg-spotify-lightgray rounded-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-spotify-green">Select Game Mode</h2>
      
      <RadioGroup 
        value={selectedMode} 
        onValueChange={(value) => setSelectedMode(value as "daily" | "streak")}
        className="w-full space-y-4"
      >
        <div className="flex items-center space-x-3 p-4 border border-spotify-green/30 rounded-md hover:bg-spotify-green/10 transition-colors cursor-pointer">
          <RadioGroupItem value="daily" id="daily" className="text-spotify-green" />
          <Label htmlFor="daily" className="flex flex-col cursor-pointer">
            <span className="text-lg font-semibold text-spotify-green">Daily Challenge</span>
            <span className="text-white/70 text-sm">10 artists everyone gets the same day. Compare with friends!</span>
          </Label>
        </div>

        <div className="flex items-center space-x-3 p-4 border border-spotify-green/30 rounded-md hover:bg-spotify-green/10 transition-colors cursor-pointer">
          <RadioGroupItem value="streak" id="streak" className="text-spotify-green" />
          <Label htmlFor="streak" className="flex flex-col cursor-pointer">
            <span className="text-lg font-semibold text-spotify-green">Streak Mode</span>
            <span className="text-white/70 text-sm">Play endlessly to see how far you can go!</span>
          </Label>
        </div>
      </RadioGroup>

      <Button 
        onClick={handleModeSelection}
        className="bg-spotify-green hover:bg-spotify-green/80 text-black font-bold py-3 px-8 w-full"
      >
        Start Playing
      </Button>
    </div>
  );
};

export default GameModeSelector;
