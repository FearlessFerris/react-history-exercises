import React, { useState } from 'react';
import axios from 'axios';
import Joke from './Joke';
import './JokeList.css';

function JokeList({ numJokes = 5 }) {
    const [ jokes, setJokes ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);

    const getJokes = async () => {
        setIsLoading( true );
        try {
            let newJokes = [];
            let seenJokes = new Set();

            while ( newJokes.length < numJokes ) {
                const response = await axios.get( 'https://icanhazdadjoke.com/', {
                    headers: { Accept: 'application/json' }
                });
                const { ...joke } = response.data;

                if (!seenJokes.has(joke.id)) {
                    seenJokes.add(joke.id);
                    newJokes.push({ ...joke, votes: 0 });
                } else {
                    console.log('duplicate found!');
                }
            }

            setJokes(newJokes);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const vote = (id, delta) => {
        setJokes((prevJokes) =>
            prevJokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j))
        );
    };

    return (
        <div className="JokeList">
            <button onClick={getJokes}>Get New Jokes</button>
            {isLoading ? (
                <div className="loading">
                    <i className="fas fa-4x fa-spinner fa-spin" />
                </div>
            ) : (
                jokes.map((j) => (
                    <Joke
                        text={j.joke}
                        key={j.id}
                        id={j.id}
                        votes={j.votes}
                        vote={vote}
                    />
                ))
            )}
        </div>
    );
}

export default JokeList;
