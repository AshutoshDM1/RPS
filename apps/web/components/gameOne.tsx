"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Scissors, Hand, Square } from "lucide-react";

type Choice = "rock" | "paper" | "scissors" | null;

export function GameOne() {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [computerChoice, setComputerChoice] = useState<Choice>(null);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState({ player: 0, computer: 0 });

  const choices: Choice[] = ["rock", "paper", "scissors"];

  const getComputerChoice = (): Choice => {
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const playGame = (choice: Choice) => {
    const computerChoice = getComputerChoice();
    setPlayerChoice(choice);
    setComputerChoice(computerChoice);

    if (choice === computerChoice) {
      setResult("It's a tie!");
    } else if (
      (choice === "rock" && computerChoice === "scissors") ||
      (choice === "paper" && computerChoice === "rock") ||
      (choice === "scissors" && computerChoice === "paper")
    ) {
      setResult("You win!");
      setScore((prev) => ({ ...prev, player: prev.player + 1 }));
    } else {
      setResult("Computer wins!");
      setScore((prev) => ({ ...prev, computer: prev.computer + 1 }));
    }
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
  };

  const getIcon = (choice: Choice) => {
    switch (choice) {
      case "rock":
        return <Square className="w-8 h-8" />;
      case "paper":
        return <Hand className="w-8 h-8" />;
      case "scissors":
        return <Scissors className="w-8 h-8" />;
      default:
        return null;
    }
  };

  const getButtonColor = (choice: Choice) => {
    switch (choice) {
      case "rock":
        return "bg-red-500 hover:bg-red-600";
      case "paper":
        return "bg-blue-500 hover:bg-blue-600";
      case "scissors":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "";
    }
  };

  return (
    <Card className="h-[60vh] ease-in duration-200 w-full max-w-md mx-auto bg-gradient-to-br from-purple-100 to-pink-100 shadow-xl select-none  ">
      <CardHeader>
        <CardTitle className="text-3xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          Rock Paper Scissors
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          Make your choice!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center space-x-4 mb-6">
          {choices.map((choice) => (
            <Button
              key={choice}
              onClick={() => playGame(choice)}
              className={`w-20 h-20 text-white transition-transform duration-200 ease-in-out transform hover:scale-110 ${getButtonColor(
                choice
              )}`}
              disabled={!!result}
            >
              {getIcon(choice)}
            </Button>
          ))}
        </div>

        <div className="min-h-[20vh] text-center space-y-4 p-4 border-2 border-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex flex-col justify-center items-center ">
          <div className="flex justify-center space-x-8">
            <div className="flex flex-col justify-center items-center" >
              <p className="text-sm text-gray-600  ">You chose:</p>
              <div className="mt-2">{getIcon(playerChoice)}</div>
            </div>
            <div className="flex flex-col justify-center items-center" >
              <p className="text-sm text-gray-600 ">Computer chose:</p>
              <div className="mt-2">{getIcon(computerChoice)}</div>
            </div>
          </div>
          <p className="text-xl font-semibold text-purple-600">{result}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <p className="text-lg font-semibold mb-4 text-gray-700">
          Score: You <span className="text-purple-600">{score.player}</span> -{" "}
          <span className="text-pink-600">{score.computer}</span> Computer
        </p>
        {result && (
          <Button
            onClick={resetGame}
            variant="outline"
            className="bg-gradient-to-r from-purple-400 to-pink-400 text-white border-none hover:from-purple-500 hover:to-pink-500"
          >
            Play Again
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
