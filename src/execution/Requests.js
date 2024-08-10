import React, { useEffect, useState } from 'react'
import { Container, Grid, Label, Table } from 'semantic-ui-react'

import { useSubstrateState } from '../substrate-lib'

export default function Main({ agreementId, currentRequest, setCurrentRequest }) {
  const { api } = useSubstrateState()
  const [requests, setRequests] = useState([])
  const [responses, setResponses] = useState([])
  const [currentRequestBody, setCurrentRequestBody] = useState({})

  useEffect(() => {
    async function fetchRequestBody() {
      let requestBody = {
        request: currentRequest.requestId && (await api.rpc.exchange.download(currentRequest.requestId)),
        response: currentRequest.responseId && (await api.rpc.exchange.download(currentRequest.responseId)),
      }

      setCurrentRequestBody(requestBody)
    }

    fetchRequestBody()
  }, [api, currentRequest])

  useEffect(() => {
    let unsub = null

    async function fetchRequests() {
      unsub = await Promise.all([
        api.query.airoExecution.requests.entries(agreementId, entries => {
          let req = entries.reduce(
            (
              acc,
              [
                {
                  args: [_, index],
                },
                requestId,
              ]
            ) => {
              acc[index] = requestId.unwrap()
              return acc
            },
            []
          )

          setRequests(req)
        }),
        api.query.airoExecution.responses.entries(agreementId, entries => {
          let res = entries.reduce(
            (
              acc,
              [
                {
                  args: [_, index],
                },
                responseId,
              ]
            ) => {
              acc[index] = responseId.unwrap()
              return acc
            },
            []
          )

          setResponses(res)
        }),
      ])
    }

    fetchRequests()
    return () => unsub && unsub[0]() && unsub[1]()
  }, [api, agreementId, currentRequest])

  function truncate(str, n) {
    return str?.length > n ? str.slice(0, n - 1) + '…' : str
  }

  return agreementId === null ? (
    <Label basic>Select an agreement to see the requests</Label>
  ) : (
    <Grid stackable columns={3}>
      <Grid.Row>
        <Grid.Column>
          <h4>Requests</h4>
          <Table selectable columns={3} fixed>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Index</Table.HeaderCell>
                <Table.HeaderCell>Request ID</Table.HeaderCell>
                <Table.HeaderCell>Response ID</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {requests.map((requestId, index) => (
                <Table.Row
                  key={index}
                  active={currentRequest.index === index}
                  onClick={() => setCurrentRequest({ index, requestId, responseId: responses[index] })}
                >
                  <Table.Cell>{index}</Table.Cell>
                  <Table.Cell>{truncate(requestId.toHuman(), 15)}</Table.Cell>
                  <Table.Cell>{truncate(responses[index]?.toHuman(), 15)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Grid.Column>
        <Grid.Column>
          {currentRequest.index && (
            <Container>
              <h4>Details</h4>
              <Table definition>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell width={2}>Request ID</Table.Cell>
                    <Table.Cell>{currentRequest.requestId?.toHuman()}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Request Body</Table.Cell>
                    <Table.Cell>{currentRequestBody.request?.toHuman()}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Response ID</Table.Cell>
                    <Table.Cell>{currentRequest.responseId?.toHuman()}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Response Body</Table.Cell>
                    <Table.Cell>{currentRequestBody.response?.toHuman()}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Container>
          )}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}
