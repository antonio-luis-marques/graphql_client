import React, { useState } from "react";

import { useQuery, useLazyQuery, gql, useMutation } from "@apollo/client";


const QUERY_ALL_USERS = gql`

    query{
        users {
            name
            username
            id
        }
    }

`;

const QUERY_ALL_MOVIES = gql`

    query{
        movies {
            name
        }
    }

`;

const GET_MOVIE_BY_NAME = gql`

    query geMovieByName($name: String!){
        movie(name: $name){
            name
        }
    }

`;

const CREATE_USER_MUTATION = gql`
    mutation createUser($input: CreateUserInput!) {
        createUser(input: $input){
            name
            id
        }
    }
`;

export default function DisplayData() {

    const [movieSearched, setMovieSearched] = useState("")



    //create user states
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [age, setAge] = useState(0)
    const [nationality, setNationality] = useState("")


    const {data, loading, error, refetch} = useQuery(QUERY_ALL_USERS);
    const {data: movieDATA} = useQuery(QUERY_ALL_MOVIES)



    const [fetchMovie, {data: movieSearchedData, error: movieError}] = useLazyQuery(GET_MOVIE_BY_NAME)


    const [createUser] = useMutation(CREATE_USER_MUTATION)
    if(loading){
        return <h1>Data is Loading...</h1>
    }
    if(data){
        console.log(data)
    }

    if(error){
        console.log(error)
    }

    if (movieError) {
        console.log(movieError)
    }
    return (
        <div>
            <div>
                <input type="text" placeholder="name... "
                    onChange={(event) => setName(event.target.value)}
                />
                <input type="text" placeholder="username... "
                    onChange={(event) => setUsername(event.target.value)}
                />
                <input type="number" placeholder="age... "
                    onChange={(event) => setAge(event.target.value)}
                />
                <input type="text" placeholder="nationality... "
                    onChange={(event) => setNationality(event.target.value.toUpperCase())}
                />
                <button onClick={() => {createUser({variables: 
                    {input: {name, username, age: Number(age), nationality}
                    
                    }}); refetch(); }}>Create User</button>
            </div>

            {data && data.users.map((user)=> {
                return <h1>Name: {user.name}</h1>
            })}

            {movieDATA && movieDATA.movies.map((movie) => {
                return <h1>Movie Name: {movie.name}</h1>
            })}

            <div>
                <input type="text" placeholder="Interestellar..." 
                    onChange={(event)=> {setMovieSearched(event.target.value)}}
                />
                <button onClick={() => fetchMovie({variables: {
                    name: movieSearched,
                },})}>Fetch Data</button>
                <div>
                    {movieSearchedData && 
                        <h1>MovieName: 

                            {movieSearchedData.movie.name}
                        </h1>
                    }

                    {movieError && <h1>Ops</h1>}
                </div>
            </div>
        </div>
    )
}