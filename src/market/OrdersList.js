import React from 'react'
import { Table } from 'semantic-ui-react'

export default function Main({ orders, selectedOrderId, onOrderSelected }) {
  return (
    <Table selectable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Order ID</Table.HeaderCell>
          <Table.HeaderCell>Model ID</Table.HeaderCell>
          <Table.HeaderCell>Total requests</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {Object.keys(orders).map(orderId => (
          <Table.Row key={orderId} active={selectedOrderId === orderId} onClick={() => onOrderSelected(orderId)}>
            <Table.Cell>{orderId}</Table.Cell>
            <Table.Cell>{orders[orderId].modelId.toHuman()}</Table.Cell>
            <Table.Cell>{orders[orderId].requestsTotal.toHuman()}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
