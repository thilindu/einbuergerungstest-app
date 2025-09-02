import { useState } from 'https://cdn.jsdelivr.net/npm/react@18.2.0/+esm'
import Quiz from './components/Quiz.jsx'

export default function App() {
  const [score, setScore] = useState(0)
  const [progress, setProgress] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Einbürgerung Test Practice</h1>
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="mb-4">
          <p className="text-lg">Score: {score}</p>
          <p className="text-lg">Progress: {Math.round(progress * 100)}%</p>
        </div>
        <Quiz setScore={setScore} setProgress={setProgress} />
      </div>
    </div>
  )
}