import React, { useEffect, useState } from 'react'
import { Container, Grid } from 'semantic-ui-react'

import { useSubstrateState } from '../substrate-lib'

import Agreements from './Agreements'
import RequestCreate from './RequestCreate'
import Requests from './Requests'

function Main(prop) {
  const { api, currentAccount } = useSubstrateState()
  const [agreements, setAgreements] = useState({})
  const [currentAgreement, setCurrentAgreement] = useState({})
  const [currentRequest, setCurrentRequest] = useState({})

  useEffect(() => {
    let unsub = null

    async function fetchOrders() {
      unsub = await api.query.airoExecution.consumerAgreements.keys(currentAccount.address, async keys => {
        let agreementIds = keys.map(({ args: [_, agreementId] }) => agreementId)
        let details = await api.query.airoExecution.agreements.multi(agreementIds)
        let agreement = agreementIds.reduce((acc, agreementId, index) => {
          let detail = details[index]
          if (detail.isNone) {
            return acc
          }
          acc[agreementId] = detail.unwrap()
          return acc
        }, {})

        setAgreements(agreement)
      })
    }

    fetchOrders()
    return () => unsub && unsub()
  }, [api, currentAccount])

  useEffect(() => {
    setCurrentAgreement({})
  }, [currentAccount])

  return (
    <Container>
      <h1>My Agreements</h1>

      <Grid stackable>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Agreements
              agreements={agreements}
              selectedAgreementId={currentAgreement.id}
              onAgreementSelected={(id, modelId) => {
                setCurrentAgreement({ id, modelId })
                setCurrentRequest({})
              }}
            />
          </Grid.Column>
          <Grid.Column>
            <RequestCreate
              agreementId={currentAgreement.id}
              modelId={currentAgreement.modelId}
              onStatusUpdate={() => {
                setCurrentRequest({})
              }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column textAlign="center">
            <Requests
              agreementId={currentAgreement.id}
              currentRequest={currentRequest}
              setCurrentRequest={setCurrentRequest}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  )
}

export default function Execution(props) {
  const { api, currentAccount } = useSubstrateState()
  return currentAccount && api.query ? <Main {...props} /> : null
}
