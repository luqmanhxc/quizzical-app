import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import he from "he";
import shuffle from "./utils";
import Quiz from "./Components/Quiz";

function App() {
    const [quizData, setQuizData] = useState([]);
    const [quizScore, setQuizScore] = useState(0);
    const [allAnswered, setAllAnswered] = useState(true);
    const [hasStarted, setHasStarted] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
        getQuizData();
    }, []);

    const getQuizData = () => {
        fetch("https://opentdb.com/api.php?amount=5&category=31&type=multiple")
            .then((res) => res.json())
            .then((data) =>
                setQuizData(
                    data.results.map((data) => {
                        return {
                            question: he.decode(data.question),
                            correctAnswer: he.decode(data.correct_answer),
                            options: shuffle(
                                data.incorrect_answers.concat(
                                    data.correct_answer
                                )
                            ),
                            selectedAnswer: "",
                            isCorrect: false,
                            id: nanoid(),
                        };
                    })
                )
            );
    };

    // Initial Render - Start Button
    function startGame() {
        setHasStarted(true);
        // getQuizData();
    }

    // Select choices
    function selectAnswer(id, answer) {
        if (!isGameOver) {
            setQuizData((prevQuizData) =>
                prevQuizData.map((qn) => {
                    return qn.id === id
                        ? { ...qn, selectedAnswer: answer }
                        : qn;
                })
            );
        }

        // Set isCorrect
        setQuizData((prevQuizData) =>
            prevQuizData.map((qn) => {
                return qn.selectedAnswer === qn.correctAnswer
                    ? { ...qn, isCorrect: true }
                    : qn;
            })
        );
    }

    // Score function
    function calcQuizScore() {
        setQuizScore(
            Object.values(quizData).reduce((acc, cur) => {
                if (cur.isCorrect) ++acc;
                return acc;
            }, 0)
        );
    }

    // Check answer / Play again button
    function checkAnswer() {
        // checkAnswer
        if (quizData.every((qn) => qn.selectedAnswer)) {
            setAllAnswered(true);
            calcQuizScore();
            setIsGameOver(true);
        } else {
            setAllAnswered(false);
        }

        // Play Again
        if (isGameOver) {
            setAllAnswered(true);
            setIsGameOver(false);
            getQuizData();
        }
    }

    console.log(quizData);

    // Question and choices render
    const quizElements = quizData.map((quiz) => {
        return (
            <Quiz
                key={quiz.id}
                questionId={quiz.id}
                question={quiz.question}
                options={quiz.options}
                correctAnswer={quiz.correctAnswer}
                selectAnswer={selectAnswer}
                selectedAnswer={quiz.selectedAnswer}
                isCorrect={quiz.isCorrect}
                isGameOver={isGameOver}
            />
        );
    });
    return (
        <div className="App">
            {!hasStarted ? (
                // Intro section (Initial render)
                <div className="intro">
                    <h1 className="intro--title">Quizzical</h1>
                    <h3 className="intro--subtext">
                        Answer 5 simple questions about anime!
                    </h3>
                    <button className="intro--btn" onClick={startGame}>
                        Start Quiz
                    </button>
                </div>
            ) : (
                // Main section - Questions and choices
                <main>
                    {quizElements}
                    <div className="quiz--bottom">
                        {isGameOver && (
                            <h3 className="quiz--score">
                                You scored {quizScore}/5 correct answers
                            </h3>
                        )}
                        <button onClick={checkAnswer} className="main-btn">
                            {isGameOver ? "Play Again" : "Check Answers"}
                        </button>
                    </div>
                    {!allAnswered && (
                        <h4 className="quiz--error">
                            Please answer all the questions
                        </h4>
                    )}
                </main>
            )}
        </div>
    );
}

export default App;
