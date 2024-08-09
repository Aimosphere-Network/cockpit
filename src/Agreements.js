import React from 'react'
// import {Grid} from 'semantic-ui-react'

import { useSubstrateState } from './substrate-lib'
import { Container } from 'semantic-ui-react'

function Main(prop) {
  return (
    <Container>
      <h1>Agreements</h1>

      <p>Coming soon...</p>
    </Container>
  )
}

export default function Agreements(props) {
  const { api, keyring } = useSubstrateState()
  return keyring.getPairs && api.query ? <Main {...props} /> : null
}
