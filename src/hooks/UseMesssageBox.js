import { useState } from 'react/cjs/react.development'

export default function useMessageBox() {
  const [
    show,
    setShow
  ] = useState(false)
  const [
    message,
    setMessage
  ] = useState('')

  const showMessageBox = (text) => {
    setShow(true)
    setMessage(text)
  }
  const hideMessageBox = () => {
    setShow(false)
  }

  return {
    showMessageBox,
    hideMessageBox,
    show,
    message
  }
}