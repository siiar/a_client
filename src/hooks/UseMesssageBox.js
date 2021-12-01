import { useState, useCallback } from 'react/cjs/react.development'

export default function useMessageBox() {
  const [
    show,
    setShow
  ] = useState(false)
  const [
    message,
    setMessage
  ] = useState('')

  const showMessageBox = useCallback((text) => {
    setShow(true)
    setMessage(text)
  }, [])
  const hideMessageBox = useCallback(() => {
    setShow(false)
  }, [])

  return {
    showMessageBox,
    hideMessageBox,
    show,
    message
  }
}