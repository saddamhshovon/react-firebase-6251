import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./configurations/firebase";

function App() {
  const [movies, setMovies] = useState([]);

  const movieCollectionRef = collection(db, "movies");

  useEffect(() => {
    const getMovies = async () => {
      try {
        const data = await getDocs(movieCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMovies(filteredData);
      } catch (error) {
        console.error(error);
      }
    };

    getMovies();
  }, []);

  return (
    <>
      <div className="app">
        <Auth />

        <div>
          {movies?.map((movie) => (
            <div key={movie?.id}>
              <h1 style={{ color: movie?.receivedAnOscar ? "green" : "red" }}>{movie?.title}</h1>
              <p>Date: {movie?.releaseDate}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
