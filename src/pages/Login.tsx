
import Login from "@/components/Login";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-black to-spotify-darkgray flex flex-col items-center justify-between p-4">
      <div className="w-full flex flex-col items-center">
        <h1 className="text-4xl font-bold text-spotify-green mb-4 mt-8">Beat The Billboard Battle</h1>
        <p className="text-white text-lg mb-8 text-center max-w-2xl">
          Developer Access - Connect your Spotify API credentials
        </p>
        
        <Login />
      </div>
      
      <footer className="w-full py-4 text-center text-white/50 text-sm mt-auto">
        <p>By PersonalMatthew 2025</p>
      </footer>
    </div>
  );
};

export default LoginPage;
