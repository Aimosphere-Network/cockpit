import React, { useState } from 'react'
import { Form, Header, Icon, Label, Segment } from 'semantic-ui-react'

import { useSubstrateState } from '../substrate-lib'
import { TxButton } from '../substrate-lib/components'
import { blake2AsHex } from '@polkadot/util-crypto'

function HelloWorld({ agreementId, onStatusUpdate }) {
  const { api } = useSubstrateState()
  const [content, setContent] = useState({ text: '' })
  const [status, setStatus] = useState(null)

  const onChange = (_, { name, value }) => setContent(prev => ({ ...prev, [name]: value }))

  const onSetStatus = nextStatus => {
    onStatusUpdate(nextStatus, status)
    setStatus(nextStatus)
  }

  let json = JSON.stringify(content)
  let hash = blake2AsHex(json)
  return (
    <Form textAlign="left">
      <Form.Input
        type="text"
        required
        label="Text"
        placeholder="Text"
        name="text"
        value={content.text}
        onChange={onChange}
      />
      <Form.Field>
        <TxButton
          label="Create Request"
          type="SIGNED-TX"
          setStatus={onSetStatus}
          txOnClickHandler={() => api.rpc.exchange.upload(hash, json)}
          attrs={{
            palletRpc: 'airoExecution',
            callable: 'requestCreate',
            inputParams: [agreementId, hash],
            paramFields: [true, true],
          }}
        />
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form.Field>
    </Form>
  )
}

function DispatchModel(props) {
  const { modelId } = props
  switch (modelId.toHuman()) {
    case 'hello-world':
      return <HelloWorld {...props} />
    default:
      return (
        <Label basic color="red">
          Model is not supported
        </Label>
      )
  }
}

function Main(props) {
  const { modelId } = props
  return (
    <Segment>
      <Header as="h4">
        <Icon name="cog" />
        <Header.Content>
          {modelId.toHuman()}
          <Header.Subheader>Model</Header.Subheader>
        </Header.Content>
      </Header>

      <DispatchModel {...props} />
    </Segment>
  )
}

export default function RequestCreate(props) {
  const { agreementId } = props
  return agreementId ? <Main {...props} /> : <Label basic>Select an agreement to create a new request</Label>
}
