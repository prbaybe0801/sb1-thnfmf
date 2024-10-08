import React, { useState, useEffect } from 'react'
import { Plus, Minus, X, Divide, Equal, RotateCcw, Copy, Check } from 'lucide-react'

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState<string>('0')
  const [history, setHistory] = useState<string>('')
  const [currentValue, setCurrentValue] = useState<string>('')
  const [operator, setOperator] = useState<string | null>(null)
  const [previousValue, setPreviousValue] = useState<string | null>(null)
  const [isNewInput, setIsNewInput] = useState<boolean>(true)
  const [isCopied, setIsCopied] = useState<boolean>(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key

      if (/^[0-9.]$/.test(key)) {
        handleNumberClick(key)
      } else if (['+', '-', '*', '/'].includes(key)) {
        handleOperatorClick(key)
      } else if (key === 'Enter' || key === '=') {
        handleEqualClick()
      } else if (key === 'Escape') {
        handleClear()
      } else if (key === 'Backspace') {
        handleBackspace()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentValue, previousValue, operator]) // Add dependencies here

  const handleNumberClick = (num: string) => {
    if (num === '.' && currentValue.includes('.')) {
      return;
    }
    if (isNewInput) {
      setDisplay(num)
      setCurrentValue(num)
      setHistory(prev => operator ? prev + num : num)
      setIsNewInput(false)
    } else {
      setDisplay(prev => prev + num)
      setCurrentValue(prev => prev + num)
      setHistory(prev => prev + num)
    }
  }

  const handleOperatorClick = (op: string) => {
    if (previousValue && currentValue && operator) {
      handleEqualClick()
    }
    setOperator(op)
    setPreviousValue(currentValue)
    setIsNewInput(true)
    setHistory(prev => `${prev} ${op} `)
  }

  const handleEqualClick = () => {
    if (previousValue && currentValue && operator) {
      const prev = parseFloat(previousValue)
      const curr = parseFloat(currentValue)
      let result = 0
      switch (operator) {
        case '+':
          result = prev + curr
          break
        case '-':
          result = prev - curr
          break
        case '*':
          result = prev * curr
          break
        case '/':
          if (curr === 0) {
            setDisplay('Error')
            setCurrentValue('')
            return
          }
          result = prev / curr
          break
      }
      const formattedResult = Number.isInteger(result) ? result.toString() : result.toFixed(8).replace(/\.?0+$/, '')
      setDisplay(formattedResult)
      setCurrentValue(formattedResult)
      setPreviousValue(null)
      setOperator(null)
      setHistory(`${prev} ${operator} ${curr} = ${formattedResult}`)
      setIsNewInput(true)
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setHistory('')
    setCurrentValue('')
    setPreviousValue(null)
    setOperator(null)
    setIsNewInput(true)
  }

  const handleBackspace = () => {
    if (currentValue.length > 1) {
      const newValue = currentValue.slice(0, -1)
      setCurrentValue(newValue)
      setDisplay(newValue)
      setHistory(prev => prev.slice(0, -1))
    } else {
      setCurrentValue('0')
      setDisplay('0')
      setHistory(prev => prev.slice(0, -1) || '0')
      setIsNewInput(true)
    }
  }

  const handleCopyResult = () => {
    navigator.clipboard.writeText(display).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  const buttonClass = "calculator-button"

  return (
    <div className="bg-gray-800 p-6 rounded-3xl shadow-2xl w-80">
      <div className="bg-gray-700 p-4 rounded-2xl mb-4 relative">
        <div className="text-right text-gray-400 text-sm font-mono mb-1 h-5 overflow-hidden">{history}</div>
        <div className="text-right text-white text-4xl font-mono">{display}</div>
        <button 
          onClick={handleCopyResult}
          className="absolute top-2 left-2 text-gray-400 hover:text-white transition-colors duration-200"
          title="Copy result"
        >
          {isCopied ? <Check size={20} /> : <Copy size={20} />}
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <button className={`${buttonClass} bg-red-500 hover:bg-red-400`} onClick={handleClear}>
          AC
        </button>
        <button className={`${buttonClass} bg-gray-600 hover:bg-gray-500`} onClick={handleBackspace}>
          ←
        </button>
        {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'].map((num) => (
          <button
            key={num}
            className={`${buttonClass} bg-gray-600 hover:bg-gray-500`}
            onClick={() => handleNumberClick(num)}
          >
            {num}
          </button>
        ))}
        <button className={`${buttonClass} bg-yellow-500 hover:bg-yellow-400`} onClick={() => handleOperatorClick('+')}>
          <Plus size={24} />
        </button>
        <button className={`${buttonClass} bg-yellow-500 hover:bg-yellow-400`} onClick={() => handleOperatorClick('-')}>
          <Minus size={24} />
        </button>
        <button className={`${buttonClass} bg-yellow-500 hover:bg-yellow-400`} onClick={() => handleOperatorClick('*')}>
          <X size={24} />
        </button>
        <button className={`${buttonClass} bg-yellow-500 hover:bg-yellow-400`} onClick={() => handleOperatorClick('/')}>
          <Divide size={24} />
        </button>
        <button className={`${buttonClass} bg-green-500 hover:bg-green-400 col-span-2`} onClick={handleEqualClick}>
          <Equal size={24} />
        </button>
      </div>
    </div>
  )
}

export default Calculator