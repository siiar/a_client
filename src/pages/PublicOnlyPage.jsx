import React from 'react'
import { useQuery } from "@apollo/client"
import { Navigate } from 'react-router-dom'
// Queries
import { LOCAL_APP } from "../queries/app"

export default function PublicOnlyPage(COMPONENT) {
  const Wrapper = (props) => {
    const {
      data: {
        user,
        token
      } = {}
    } = useQuery(LOCAL_APP.QUERY)
    return !token || !user
      ? <COMPONENT {...props} />
      : <Navigate to="/home" replace={true}/>
  }
  return Wrapper;
}