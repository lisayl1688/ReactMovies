import { useEffect, useState } from "react";
import { CompleteType, DirectorType, MovieType } from "../types/supabase-types-own";
import supabaseClient from "../lib/supabaseClient";

const Movies = () => {
    const [movies,setMovies] = useState<CompleteType[]>([]);
    const [directors,setDirectors] = useState<DirectorType[]>([]);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [genreFilter, setGenreFilter] = useState<string>('');
    const [sortColumn, setSortColumn] = useState<string>('created_at');
    
    useEffect(()=>{
        const fetchMovies=async()=>{
            // let selectQuery = supabaseClient.from('Movies').select('*,Directors(*)');
            let selectQuery = supabaseClient.from('Movies').select(`
        id,
        title,
        year,
        length,  
        rating,
        genres,
        created_at,
        director_id,
        Directors (
            *
        )
    `);

            if(searchTerm){
                selectQuery = selectQuery.ilike('title', `%${searchTerm}%`);
            }


            if (genreFilter) {
                //like weil nach textbestandteilen
                selectQuery = selectQuery.like('genres', `%${genreFilter}%`);
            }


            // if (sortColumn) {
            //     selectQuery = selectQuery.order(sortColumn, { ascending: true });
            // }

            const result = await selectQuery;

            if(result.error){
                console.log(result.error);
                setMovies([]); 
            }else {
                if(result.data){
                    setMovies(result.data as CompleteType[]);

                }
                
            }
        }
        fetchMovies();



    }, [searchTerm, genreFilter])

    console.log(movies);
    console.log(genreFilter);



    return ( <>
    <div className="MovieContainer">
        <header className="MovieHeader">
            <div className="MovieListFilters">
                <label>
                    <input id="titelSearch" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Suche nach Titel"/>
                </label>

                <label>
                    <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
                        <option value="">Alle</option>
                        <option value="Drama">Drama</option>
                        <option value="Thriller">Thriller</option>
                        <option value="Mystery">Mystery</option>
                        <option value="Romance">Romance</option>
                    </select>
                </label>

                {/* <label>
                    <button value={} onClick={(e) => setSortColumn(e.target.value)}></button>
                </label> */}

            </div>


        </header>
        <main className="MovieListContainer">
        {movies.length === 0 && <p>No Result</p>}
        <div className="movie-list">
          {movies &&
            movies.length > 0 && 
            movies.map((movie) => (
              <div key={movie.id} className="movie-list-item">
           
                  <strong>{movie.title}</strong>
                  <p>{movie.year}</p>
                  <p>{movie.Directors.firstName} {movie.Directors.lastName}</p>
                  <p>{movie.length}</p>
                  <p>{movie.genres}</p>
                  <p>{movie.rating}</p>
            
              </div>
            ))}
        </div>
        </main>

    </div>

    </> );
}
 
export default Movies;