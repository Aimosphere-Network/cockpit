import React, { useEffect, useState } from 'react'
import { Modal, Button, Card } from 'semantic-ui-react'

import { useSubstrateState } from './substrate-lib'

function Main(props) {
  const { api } = useSubstrateState()
  const [metadata, setMetadata] = useState({ data: null, version: null })

  useEffect(() => {
    const getMetadata = async () => {
      try {
        const data = await api.rpc.state.getMetadata()
        setMetadata({ data, version: data.version })
      } catch (e) {
        console.error(e)
      }
    }
    getMetadata()
  }, [api.rpc.state])

  return (
    <Card>
      <Card.Content>
        <Card.Header>Metadata</Card.Header>
        <Card.Meta>
          <span>v{metadata.version}</span>
        </Card.Meta>
      </Card.Content>
      <Card.Content extra>
        <Modal trigger={<Button>Show Metadata</Button>}>
          <Modal.Header>Runtime Metadata</Modal.Header>
          <Modal.Content scrolling>
            <Modal.Description>
              <pre>
                <code>{JSON.stringify(metadata.data, null, 2)}</code>
              </pre>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </Card.Content>
    </Card>
  )
}

export default function Metadata(props) {
  const { api } = useSubstrateState()
  return api.rpc && api.rpc.state && api.rpc.state.getMetadata ? <Main {...props} /> : null
}
