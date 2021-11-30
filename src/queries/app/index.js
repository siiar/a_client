import { gql } from '@apollo/client'
import raw from 'raw.macro'


export const LOCAL_APP = {
  QUERY: gql`${raw('./LocalApp.gql')}`
}