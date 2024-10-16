import Game from "@/components/game";

const Home = () => {
  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <Game />
      </div>
    </>
  );
};

export default Home;
