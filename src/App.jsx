import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "./configurations/firebase";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [movies, setMovies] = useState([]);

  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newMovieReleaseDate, setNewMovieReleaseDate] = useState(0);
  const [newMovieGotOscar, setNewMovieGotOscar] = useState(false);

  const [updatedMovieTitle, setUpdatedMovieTitle] = useState("");

  const [fileToUpload, setFileToUpload] = useState(null);

  const movieCollectionRef = collection(db, "movies");

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

  useEffect(() => {
    getMovies();
  }, []);

  const onSubmitNewMovie = async () => {
    try {
      await addDoc(movieCollectionRef, {
        title: newMovieTitle,
        releaseDate: newMovieReleaseDate,
        receivedAnOscar: newMovieGotOscar,
        userId: auth?.currentUser?.uid,
      });

      getMovies();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMovie = async (id) => {
    try {
      const movie = doc(db, "movies", id);
      await deleteDoc(movie);
      getMovies();
    } catch (error) {
      console.error(error);
    }
  };

  const onUpdateMovieTitle = async (id) => {
    try {
      const movie = doc(db, "movies", id);
      await updateDoc(movie, { title: updatedMovieTitle });
      getMovies();
    } catch (error) {
      console.error(error);
    }
  };

  const onFileUpload = async () => {
    if (!fileToUpload) return;
    try {
      const filesFolderRef = ref(storage, `files/${fileToUpload.name}`);
      await uploadBytes(filesFolderRef, fileToUpload);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="app">
        <Auth />

        <div>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Title..."
            onChange={(e) => setNewMovieTitle(e.target.value)}
          />
          <input
            type="number"
            name="releaseDate"
            id="releaseDate"
            placeholder="Release Date..."
            onChange={(e) => setNewMovieReleaseDate(e.target.value)}
          />
          <input
            type="checkbox"
            name="receivedAnOscar"
            id="receivedAnOscar"
            checked={newMovieGotOscar}
            onChange={(e) => setNewMovieGotOscar(e.target.checked)}
          />
          <label htmlFor="receivedAnOscar">Received An Oscar</label>
          <button onClick={onSubmitNewMovie}>Add Movie</button>
        </div>

        <div>
          {movies?.map((movie) => (
            <div key={movie?.id}>
              <h1 style={{ color: movie?.receivedAnOscar ? "green" : "red" }}>
                {movie?.title}
              </h1>
              <p>Date: {movie?.releaseDate}</p>
              <button onClick={() => deleteMovie(movie.id)}>
                Delete Movie
              </button>

              <input
                type="text"
                name="newTitle"
                id={"newTitle" + movie.id}
                placeholder="New Title..."
                onChange={(e) => setUpdatedMovieTitle(e.target.value)}
              />
              <button onClick={() => onUpdateMovieTitle(movie.id)}>
                Update Movie Title
              </button>
            </div>
          ))}
        </div>

        <div>
          <input
            type="file"
            name="file"
            id="file"
            onChange={(e) => setFileToUpload(e.target.files[0])}
          />
          <button onClick={onFileUpload}>Upload File</button>
        </div>
      </div>
    </>
  );
}

export default App;
