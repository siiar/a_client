import React from 'react'
import { useQuery } from "@apollo/client"
import { Navigate } from 'react-router-dom'
// Queries
import { LOCAL_APP } from "../queries/app"

export default function AuthorizedPage(COMPONENT) {
  const Wrapper = (props) => {
    const {
      data: {
        token
      } = {}
    } = useQuery(LOCAL_APP.QUERY)
    return token && token.length > 0
      ? <COMPONENT {...props} />
      : <Navigate to="/login" />
  }
  return Wrapper;
}