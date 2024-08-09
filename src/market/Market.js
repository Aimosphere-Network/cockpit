import React, { useEffect, useState } from 'react'
import { Container, Grid } from 'semantic-ui-react'

import { useSubstrateState } from '../substrate-lib'

import BidsList from './BidsList'
import OrderCreate from './OrderCreate'
import OrdersList from './OrdersList'

function Main(prop) {
  const { api, currentAccount } = useSubstrateState()
  const [orders, setOrders] = useState({})
  const [currentOrderId, setCurrentOrderId] = useState(null)

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
  }, [api.query.airoMarket, currentAccount, orders])

  const statusUpdate = (status, prevStatus) => {
    if (status !== prevStatus) {
      setOrders({})
    }
  }

  return (
    <Container>
      <h1>My Orders</h1>

      <Grid stackable columns="equal">
        <Grid.Row>
          <Grid.Column>
            <OrderCreate onStatusUpdate={statusUpdate} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <OrdersList orders={orders} selectedOrderId={currentOrderId} onOrderSelected={setCurrentOrderId} />
          </Grid.Column>
          <Grid.Column textAlign="center">
            <BidsList orderId={currentOrderId} />
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
