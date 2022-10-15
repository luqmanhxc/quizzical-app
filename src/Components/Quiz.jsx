export default function Quiz(props) {
    const choiceElements = props.options.map((option, idx) => {
        let styles;
        if (props.isGameOver) {
            if (option === props.correctAnswer) {
                styles = { backgroundColor: "#94D7A2" };
            } else if (
                option !== props.correctAnswer &&
                option === props.selectedAnswer
            ) {
                styles = { backgroundColor: "#F8BCBC", opacity: "0.5" };
            } else {
                styles = { opacity: "0.5" };
            }
        } else {
            styles = {
                backgroundColor:
                    props.selectedAnswer === option ? "#D6DBF5" : "#F5F7FB",
                border:
                    props.selectedAnswer === option
                        ? "none"
                        : "0.794239px solid #4d5b9e",
            };
        }

        return (
            <div
                className="quiz--choice"
                style={styles}
                key={idx}
                onClick={() => props.selectAnswer(props.questionId, option)}
            >
                {option}
            </div>
        );
    });

    return (
        <div className="quiz">
            <h2 className="quiz--question">{props.question}</h2>
            <div className="quiz--choices">{choiceElements}</div>
        </div>
    );
}
