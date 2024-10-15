"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Scissors, Hand, Square, Trophy } from "lucide-react";

type Choice = "rock" | "paper" | "scissors" | null;

function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
      <div className="absolute inset-0 opacity-30">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animation: `float ${Math.random() * 10 + 5}s linear infinite`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

function Game() {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [computerChoice, setComputerChoice] = useState<Choice>(null);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [showResult, setShowResult] = useState(false);

  const choices: Choice[] = ["rock", "paper", "scissors"];

  const getComputerChoice = (): Choice => {
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const playGame = (choice: Choice) => {
    const computerChoice = getComputerChoice();
    setPlayerChoice(choice);
    setComputerChoice(computerChoice);

    setTimeout(() => {
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
      setShowResult(true);
    }, 1000);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setShowResult(false);
  };

  const getIcon = (choice: Choice) => {
    switch (choice) {
      case "rock":
        return <Square className="w-12 h-12" />;
      case "paper":
        return <Hand className="w-12 h-12" />;
      case "scissors":
        return <Scissors className="w-12 h-12" />;
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
    <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden transition-all duration-300 ease-in-out transform ">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardTitle className="text-3xl text-center font-bold">
          Rock Paper Scissors
        </CardTitle>
        <CardDescription className="text-center text-white/80">
          Choose your weapon!
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-center space-x-4 mb-6">
          {choices.map((choice) => (
            <Button
              key={choice}
              onClick={() => playGame(choice)}
              className={`w-24 h-24 rounded-full text-white transition-all duration-300 ease-in-out transform hover:scale-110 hover:rotate-12 ${getButtonColor(
                choice
              )} ${
                playerChoice === choice
                  ? "ring-4 ring-white ring-opacity-50"
                  : ""
              }`}
              disabled={!!result}
            >
              {getIcon(choice)}
            </Button>
          ))}
        </div>
        <div
          className={`text-center space-y-4 p-4 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 transition-all duration-500 ease-in-out ${
            showResult
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform -translate-y-4"
          }`}
        >
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">You chose:</p>
              <div
                className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${getButtonColor(
                  playerChoice
                )}`}
              >
                {getIcon(playerChoice)}
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Computer chose:</p>
              <div
                className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${getButtonColor(
                  computerChoice
                )}`}
              >
                {getIcon(computerChoice)}
              </div>
            </div>
          </div>
          <p className="text-2xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            {result}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center bg-gray-50 p-4">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <p className="text-lg font-semibold text-gray-700">
            You <span className="text-purple-600">{score.player}</span> -{" "}
            <span className="text-pink-600">{score.computer}</span> Computer
          </p>
        </div>
        {result && (
          <Button
            onClick={resetGame}
            variant="outline"
            className="bg-gradient-to-r from-purple-400 to-pink-400 text-white border-none hover:from-purple-500 hover:to-pink-500 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Play Again
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function GameTwo() {
  return (
    <div className="h-screen w-screen flex justify-center items-center overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      <BackgroundAnimation />
      <Game />
    </div>
  );
}
