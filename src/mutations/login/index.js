import { gql } from '@apollo/client'
import raw from 'raw.macro'

export const LOGIN = {
  QUERY: gql`${raw('./Login.gql')}`,
  VARIABLES: (username, password) => ({ variables: { username, password } })
}