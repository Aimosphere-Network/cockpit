import React, { useEffect, useState } from 'react'
import { Label, Table } from 'semantic-ui-react'
import { useSubstrateState } from '../substrate-lib'
import { TxButton } from '../substrate-lib/components'

function Main({ orderId, onStatusUpdate }) {
  const { api, keyring } = useSubstrateState()
  const [bids, setBids] = useState([])
  const [status, setStatus] = useState(null)

  useEffect(() => {
    let unsub = null

    async function fetchBids() {
      unsub = await api.query.airoMarket.orderBids.entries(orderId, entries => {
        let bids = entries.map(
          ([
            {
              args: [_, provider],
            },
            bid,
          ]) => ({
            provider: provider,
            name: keyring.getPairs().find(account => account.address === provider.toHuman())?.meta.name,
            details: bid.unwrap(),
          })
        )
        setBids(bids)
      })
    }

    fetchBids()
    return () => unsub && unsub()
  }, [api.query.airoMarket, keyring, orderId, status])

  const statusUpdate = status => {
    onStatusUpdate(status)
    setStatus(status)
  }

  return (
    <Table fixed>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Provider</Table.HeaderCell>
          <Table.HeaderCell width={4}>Price/Request</Table.HeaderCell>
          <Table.HeaderCell width={4}></Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {bids.map(bid => (
          <Table.Row key={bid.provider}>
            <Table.Cell>{bid.name || bid.provider.toHuman()}</Table.Cell>
            <Table.Cell>{bid.details.pricePerRequest.toHuman()}</Table.Cell>
            <Table.Cell>
              <TxButton
                floated="right"
                label="Approve"
                type="SIGNED-TX"
                color="green"
                setStatus={statusUpdate}
                attrs={{
                  palletRpc: 'airoMarket',
                  callable: 'bidAccept',
                  inputParams: [orderId, bid.provider],
                  paramFields: [true, true],
                }}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>

      <Table.Footer fullWidth>
        <Table.Row>
          <Table.HeaderCell colSpan="3">
            <div style={{ overflowWrap: 'break-word' }}>{status}</div>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
  )
}

export default function Bids(props) {
  const { orderId } = props
  return orderId ? <Main {...props} /> : <Label basic>Select an order to see the bids</Label>
}
