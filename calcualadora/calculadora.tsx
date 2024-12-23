'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const Calculator = () => {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [graphData, setGraphData] = useState([])
  const [graphExpression, setGraphExpression] = useState('Math.sin(x)')

  const handleClick = (value: string) => {
    if (display === '0' && value !== '.') {
      setDisplay(value)
      setExpression(value)
    } else {
      setDisplay(display + value)
      setExpression(expression + value)
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setExpression('')
  }

  const handleCalculate = () => {
    try {
      const result = Function(`'use strict'; return (${expression})`)()
      setDisplay(result.toString())
      setExpression(result.toString())
    } catch (error) {
      setDisplay('Error')
      setExpression('')
    }
  }

  const handleFunction = (func: string) => {
    setExpression(`${func}(${expression})`)
    setDisplay(func)
  }

  const generateGraphData = () => {
    const data = []
    for (let x = -10; x <= 10; x += 0.5) {
      try {
        const y = Function(`'use strict'; return (${graphExpression.replace(/x/g, x.toString())})`)()
        if (!isNaN(y) && isFinite(y)) {
          data.push({ x, y })
        }
      } catch (error) {
        console.error(`Error calculating for x=${x}:`, error)
      }
    }
    setGraphData(data)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gray-900 shadow-xl text-white">
      <CardHeader className="bg-gradient-to-r from-purple-700 to-indigo-700">
        <CardTitle className="text-2xl font-bold">Calculadora Científica Simple</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="calculator">Calculadora</TabsTrigger>
            <TabsTrigger value="graph">Gráfico</TabsTrigger>
          </TabsList>
          <TabsContent value="calculator">
            <Input value={display} readOnly className="mb-4 text-right text-2xl font-mono bg-gray-800 text-white border-gray-700" />
            <div className="grid grid-cols-4 gap-2">
              {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map((btn) => (
                <Button key={btn} onClick={() => btn === '=' ? handleCalculate() : handleClick(btn)} 
                        className="text-lg font-semibold bg-gray-700 hover:bg-gray-600 text-white">
                  {btn}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {['Math.sin', 'Math.cos', 'Math.tan', 'Math.log10', 'Math.sqrt', 'Math.pow'].map((func) => (
                <Button key={func} onClick={() => handleFunction(func)}
                        className="text-sm font-medium bg-purple-600 hover:bg-purple-500 text-white">
                  {func.replace('Math.', '')}
                </Button>
              ))}
            </div>
            <Button onClick={handleClear} className="w-full mt-4 bg-red-600 hover:bg-red-500 text-white">Clear</Button>
          </TabsContent>
          <TabsContent value="graph">
            <div className="space-y-4">
              <Input 
                value={graphExpression} 
                onChange={(e) => setGraphExpression(e.target.value)} 
                placeholder="Ingrese una expresión (ej: Math.sin(x))"
                className="w-full mb-2 bg-gray-800 text-white border-gray-700"
              />
              <Button onClick={generateGraphData} className="w-full bg-green-600 hover:bg-green-500 text-white">
                Generar Gráfico
              </Button>
              <div className="h-[400px] w-full bg-gray-800 rounded-lg shadow-inner p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={graphData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="x" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                    <Legend />
                    <Line type="monotone" dataKey="y" stroke="#8884d8" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default Calculator

