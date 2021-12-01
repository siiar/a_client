import React from 'react'
import {
  useMutation,
  useApolloClient
} from '@apollo/client'
import {
  useEffect,
  useState
} from 'react/cjs/react.development'
// Use Message Box Hook
import useMessageBox from '../../hooks/UseMesssageBox'
// Mock Data
import { forms } from './mock'
// Mutations
import { LOGIN } from '../../mutations/login/index'
// Queries
import { LOCAL_APP } from '../../queries/app/index'
// Components
import MessageBox from '../../components/message-box/MessageBox'
import FormCard from '../../components/form-card/FormCard'
// Public Only Page HOC
import PublicOnlyPage from '../PublicOnlyPage'
// Style
import style from './Login.module.css'

export default PublicOnlyPage(function Login() {
  const client = useApolloClient()
  const {login: loginForm} = forms
  /**
   * Message Box Hook
   */
  const {
    showMessageBox,
    hideMessageBox,
    show,
    message
  } = useMessageBox()
  // Username Input
  const [
    username,
    setUsername
  ] = useState('')
  // Password Input
  const [
    password,
    setPassword
  ] = useState('')
  /**
   * Mutations
   */
  // Login Mutation
  const [
    login,
    {
      data,
      loading,
      error
    }
  ] = useMutation(LOGIN.QUERY, { 
    onError: () => console.log('no-sweat'),
    onCompleted: () => hideMessageBox()
  })
  // Login Effect Observer
  useEffect(() => {
    const {
      login: {
        user,
        token
      } = {}
    } = data
        ? data
        : {}
    return token && data
      ? client.writeQuery({
        query: LOCAL_APP.QUERY,
        data: {
          user,
          token
        },
      })
      : null
  }, [data, loading, client])
  /**
   * Input Handlerr
   */
  // Input Handlers Map
  const onInputChange = ({ name, value }) => {
    const map = {
      username: setUsername,
      password: setPassword
    }
    map[name](value)
  }
  /**
   * Button Handlers
   */
  const onBtnClick = ({name}) => {
    const map = {
      'login': onBtnClickLogin
    }
    map[name]()
  }
  const onBtnClickLogin = () => {
    login({
      ...LOGIN.VARIABLES(username, password),
      context: {debounceKey: '1'}
    })
  }
  /**
   * Loading Side Effects
   */
  useEffect(() => {
    return loading
      ? showMessageBox('Loading...')
      : null
  }, [loading, showMessageBox])
  /**
   * Error Side Effects
   */
  useEffect(() => {
    return error
      ? showMessageBox(error.message)
      : null
  }, [error, showMessageBox])
  /**
   * Render
   */
  return (
    <div className={`page ${style.page}`}>
      <MessageBox
        show={show}
        message={message}
        onPressClose={() => hideMessageBox()}
      />
      <FormCard
        themeName='glow-theme'
        title={loginForm.title}
        inputs={loginForm.inputs}
        buttons={loginForm.buttons}
        onInputChange={({ name, value }) => onInputChange({ name, value })}
        onBtnClick={({ name }) => onBtnClick({ name })}
      />
    </div>
  )
})