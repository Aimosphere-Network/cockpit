import React, { useState } from 'react'
import { Form } from 'semantic-ui-react'
import { TxButton } from '../substrate-lib/components'

export default function Main({ onStatusUpdate }) {
  const [status, setStatus] = useState(null)
  const [formState, setFormState] = useState({ modelId: '', requestsTotal: 1 })

  const onChange = (_, { name, value }) => setFormState(prev => ({ ...prev, [name]: value }))

  const onSetStatus = nextStatus => {
    onStatusUpdate(nextStatus, status)
    setStatus(nextStatus)
  }

  return (
    <Form>
      <Form.Group>
        <Form.Input
          type="text"
          required
          inline
          label="Model ID"
          placeholder="Model ID"
          name="modelId"
          value={formState.modelId}
          onChange={onChange}
        />
        <Form.Input
          type="number"
          min="1"
          required
          inline
          label="Total requests"
          placeholder="Total requests"
          name="requestsTotal"
          value={formState.requestsTotal}
          onChange={onChange}
        />
        <Form.Field>
          <TxButton
            label="Create Order"
            type="SIGNED-TX"
            setStatus={onSetStatus}
            attrs={{
              palletRpc: 'airoMarket',
              callable: 'orderCreate',
              inputParams: [formState.modelId, formState.requestsTotal],
              paramFields: [true, true],
            }}
          />
        </Form.Field>
      </Form.Group>
      <div style={{ overflowWrap: 'break-word' }}>{status}</div>
    </Form>
  )
}
