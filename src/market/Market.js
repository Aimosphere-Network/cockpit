import React, { useEffect, useState } from 'react'
import { Container, Grid } from 'semantic-ui-react'

import { useSubstrateState } from '../substrate-lib'

import Bids from './Bids'
import OrderCreate from './OrderCreate'
import Orders from './Orders'

function Main(prop) {
  const { api, currentAccount } = useSubstrateState()
  const [orders, setOrders] = useState({})
  const [currentOrderId, setCurrentOrderId] = useState(null)
  const [txStatus, setTxStatus] = useState(null)

  useEffect(() => {
    let unsub = null

    async function fetchOrders() {
      unsub = await api.query.airoMarket.consumerOrders.keys(currentAccount.address, async keys => {
        let orderIds = keys.map(({ args: [_, orderId] }) => orderId)
        let details = await api.query.airoMarket.orders.multi(orderIds)
        let orders = orderIds.reduce((acc, orderId, index) => {
          let detail = details[index]
          if (detail.isNone) {
            return acc
          }
          acc[orderId] = detail.unwrap()
          return acc
        }, {})

        setOrders(orders)
      })
    }

    fetchOrders()
    return () => unsub && unsub()
  }, [api, currentAccount, txStatus])

  useEffect(() => {
    setCurrentOrderId(null)
  }, [currentAccount])

  return (
    <Container>
      <h1>My Orders</h1>

      <Grid stackable>
        <Grid.Row>
          <Grid.Column>
            <OrderCreate onStatusUpdate={setTxStatus} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={2}>
          <Grid.Column>
            <Orders orders={orders} selectedOrderId={currentOrderId} onOrderSelected={setCurrentOrderId} />
          </Grid.Column>
          <Grid.Column textAlign="center">
            <Bids orderId={currentOrderId} onStatusUpdate={setTxStatus} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  )
}

export default function Market(props) {
  const { api, currentAccount } = useSubstrateState()
  return currentAccount && api.query ? <Main {...props} /> : null
}
