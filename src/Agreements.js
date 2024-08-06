import React from 'react'
// import {Grid} from 'semantic-ui-react'

import {useSubstrateState} from "./substrate-lib";

function Main(prop) {
  return (
    <h1>Agreements</h1>
  )
}

export default function Agreements(props) {
  const {api, keyring} = useSubstrateState()
  return keyring.getPairs && api.query ? <Main {...props} /> : null
}
