import { useEffect, useState } from 'react';
import questions from './questions.json';

function App() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  const handleAnswer = (index) => {
    setSelected(index);
    setAnswered(true);
  };

  const nextQuestion = () => {
    setCurrent((prev) => (prev + 1) % questions.length);
    setSelected(null);
    setAnswered(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Einbürgerungstest</h1>
      <h2>{questions[current].question}</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {questions[current].answers.map((answer, i) => (
          <li key={i} style={{ marginBottom: '10px' }}>
            <button
              onClick={() => handleAnswer(i)}
              style={{
                padding: '10px',
                width: '100%',
                backgroundColor:
                  answered && i === questions[current].correct
                    ? 'lightgreen'
                    : answered && selected === i
                    ? 'salmon'
                    : '#eee',
                border: '1px solid #ccc',
                textAlign: 'left',
              }}
            >
              {answer}
            </button>
          </li>
        ))}
      </ul>
      {answered && (
        <div style={{ marginTop: '20px' }}>
          <p>
            {selected === questions[current].correct
              ? '✅ Richtig!'
              : '❌ Falsch.'}
          </p>
          <button onClick={nextQuestion}>Nächste Frage</button>
        </div>
      )}
    </div>
  );
}

export default App;
