"use client"

import { useState } from "react"

type UseCharacterLimitProps = {
  maxLength: number
  initialValue?: string
}

export function useCharacterLimit({
  maxLength,
  initialValue = "",
}: UseCharacterLimitProps) {
  const [value, setValue] = useState(initialValue)
  const [characterCount, setCharacterCount] = useState(initialValue.length)

  const handleChange = (
      newValue: string
  ) => {
    if (newValue.length <= maxLength) {
      setValue(newValue)
      setCharacterCount(newValue.length)
    }
  }

  return {
    value,
    characterCount,
    handleChange,
    maxLength,
  }
}
