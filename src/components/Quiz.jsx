import { useState, useEffect } from 'https://cdn.jsdelivr.net/npm/react@18.2.0/+esm'
import questions from '../data/questions.json'

export default function Quiz({ setScore, setProgress }) {
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [showDeepDive, setShowDeepDive] = useState(false)
  const [repetitionSchedule, setRepetitionSchedule] = useState({})

  // Sounds for feedback
  const correctSound = new Audio('/sounds/correct.mp3')
  const wrongSound = new Audio('/sounds/wrong.mp3')

  // Initialize spaced repetition schedule
  useEffect(() => {
    const schedule = questions.reduce((acc, _, index) => {
      acc[index] = { nextReview: new Date(), interval: 1 }
      return acc
    }, {})
    setRepetitionSchedule(schedule)
    selectNextQuestion()
  }, [])

  // Select next question based on spaced repetition
  const selectNextQuestion = () => {
    const now = new Date()
    let nextIndex = questionIndex
    let minInterval = Infinity

    Object.keys(repetitionSchedule).forEach((index) => {
      if (repetitionSchedule[index].nextReview <= now && repetitionSchedule[index].interval < minInterval) {
        minInterval = repetitionSchedule[index].interval
        nextIndex = parseInt(index)
      }
    })

    setCurrentQuestion(questions[nextIndex])
    setQuestionIndex(nextIndex)
    setSelectedAnswer(null)
    setFeedback(null)
    setShowDeepDive(false)
    setProgress((nextIndex + 1) / questions.length)
  }

  // Handle answer submission
  const handleAnswer = (answer) => {
    setSelectedAnswer(answer)
    const isCorrect = answer === currentQuestion.correctAnswer

    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) {
      setScore((prev) => prev + 1)
      correctSound.play()
    } else {
      wrongSound.play()
    }

    // Update spaced repetition schedule
    setRepetitionSchedule((prev) => {
      const newSchedule = { ...prev }
      const interval = isCorrect ? prev[questionIndex].interval * 2 : 1
      const nextReview = new Date(Date.now() + interval * 24 * 60 * 60 * 1000)
      newSchedule[questionIndex] = { nextReview, interval }
      return newSchedule
    })

    setTimeout(selectNextQuestion, 2000)
  }

  if (!currentQuestion) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{currentQuestion.question}</h2>
      <div className="space-y-2">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            disabled={selectedAnswer !== null}
            className={`w-full p-2 rounded-lg text-left transition-colors ${
              selectedAnswer === option
                ? feedback === 'correct'
                  ? 'bg-green-200'
                  : 'bg-red-200'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {feedback && (
        <div
          className={`p-4 rounded-lg ${
            feedback === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          } animate-bounce`}
        >
          <p>{feedback === 'correct' ? 'Correct!' : 'Wrong!'}</p>
          <p className="mt-2">{currentQuestion.backgroundInfo}</p>
          <button
            onClick={() => setShowDeepDive(true)}
            className="mt-2 text-blue-600 hover:underline"
          >
            Learn More
          </button>
        </div>
      )}
      {showDeepDive && (
        <div className="p-4 bg-blue-100 rounded-lg">
          <h3 className="text-lg font-bold">Did You Know?</h3>
          <p>{currentQuestion.deepDive}</p>
        </div>
      )}
    </div>
  )
}