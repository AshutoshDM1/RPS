"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useSocket from "@/hooks/useSocket";
import { Scissors, Hand, Square, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import ColorfulSpinningLoader from "./ui/laoder";
import { toast } from "sonner";

type Choice = "rock" | "paper" | "scissors" | null;

export default function Game() {
  const socket = useSocket("http://localhost:4000");
  const [roomId, setRoomId] = useState("room1");
  const [joinRoom, setJoinRoom] = useState(true);
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [opponentChoice, setopponentChoice] = useState<Choice>(null);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState({ You: 0, Opponent: 0 });
  const [showResult, setShowResult] = useState(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  console.log(setRoomId);
  useEffect(() => {
    if (socket) {
      // Listen for startGame event
      socket.on("startGame", (message: string) => {
        console.log(message);
        setGameStarted(true);
      });

      // Listen for gameResult event
      socket.on(
        "gameResult",
        ({ player1, choice1, player2, choice2, result, winner }) => {
          toast.dismiss();
          console.log(player2);
          if (result != "It's a tie!") {
            if (socket.id === winner) {
              setResult("You Win");
              console.log(score);
              setScore((prev) => ({ ...prev, You: prev.You + 1 }));
            } else {
              setResult("You Lose");
              console.log(score);

              setScore((prev) => ({ ...prev, Opponent: prev.Opponent + 1 }));
            }
          } else {
            setResult("No One Wins");
          }
          setopponentChoice(player1 === socket.id ? choice2 : choice1);
          setShowResult(result);
        }
      );

      // Clean up socket listeners when the component unmounts
      return () => {
        socket.off("startGame");
        socket.off("gameResult");
      };
    }
  }, [socket]);

  // Handle joining a room
  const handleJoinRoom = () => {
    if (socket) {
      socket.emit("joinRoom", roomId);
      console.log("Joined room:", roomId);
      setJoinRoom(false);
    } else {
      console.error("Socket is not initialized");
    }
  };

  const sendPlayerChoice = (choice: Choice) => {
    setPlayerChoice(choice);
    toast.loading("Waiting for opponent choice");
    const data = { roomId, choice };
    if (socket) {
      socket.emit("playerChoice", data);
      console.log("Player choice sent:", data);
    } else {
      console.error("Socket is not initialized");
    }
  };

  const choices: Choice[] = ["rock", "paper", "scissors"];

  const resetGame = () => {
    setPlayerChoice(null);
    setopponentChoice(null);
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
    <>
      <div className="h-[8vh] w-full flex justify-between items-center px-5 ">
        <h1 className="text-center text-[#ffffff] font-bold italic text-[2rem] ">
          PRS+{" "}
        </h1>
        <Button
          onClick={handleJoinRoom}
          className=" bg-slate-50 hover:bg-slate-200 text-black "
        >
          Join Room
        </Button>
      </div>
      <div className="h-[92vh] w-full flex flex-col items-center justify-center ">
        <Card className="min-h-[60vh] w-full max-w-md mx-auto bg-white/90 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden transition-all duration-300 ease-in-out transform flex flex-col justify-between ">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardTitle className="text-3xl text-center font-bold">
              Rock Paper Scissors
            </CardTitle>
            <CardDescription className="text-center text-white/80">
              Choose your weapon!
            </CardDescription>
          </CardHeader>
          {!gameStarted ? (
            <>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center space-x-4 mb-6">
                  {joinRoom ? (
                    <h1 className="text-[#f62e7b] font-bold italic text-[2rem]">
                      {" "}
                      Join Room to Play
                    </h1>
                  ) : (
                    <>
                      <h1 className="text-[#f62e7b] font-bold italic text-[1.5rem]">
                        Waiting for Opponent...
                      </h1>
                      <ColorfulSpinningLoader />
                    </>
                  )}
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardContent className="p-6">
                <div className="flex justify-center space-x-4 mb-6">
                  {choices.map((choice) => (
                    <Button
                      key={choice}
                      onClick={() => {
                        sendPlayerChoice(choice);
                      }}
                      className={`w-24 h-24 rounded-full text-white transition-all duration-300 ease-in-out transform hover:scale-110 hover:rotate-12 ${getButtonColor(
                        choice
                      )} ${
                        playerChoice === choice
                          ? "ring-4 ring-white ring-opacity-50"
                          : ""
                      }`}
                      disabled={!!playerChoice}
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
                      <p className="text-sm text-gray-600 mb-2">
                        Opponent chose:
                      </p>
                      <div
                        className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${getButtonColor(
                          opponentChoice
                        )}`}
                      >
                        {getIcon(opponentChoice)}
                      </div>
                    </div>
                  </div>
                  <p className="text-2xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                    {result}
                  </p>
                </div>
              </CardContent>
            </>
          )}

          <CardFooter className="flex flex-col items-center bg-gray-50 p-4">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <p className="text-lg font-semibold text-gray-700">
                You <span className="text-purple-600">{score.You}</span> -{" "}
                <span className="text-pink-600">{score.Opponent}</span> Opponent
              </p>
            </div>
            {showResult && (
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
      </div>
    </>
  );
}
