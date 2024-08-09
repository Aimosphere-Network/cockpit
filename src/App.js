import React, { createRef } from 'react'
import { Container, Dimmer, Grid, Loader, Message, Sticky, Tab } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import { SubstrateContextProvider, useSubstrateState } from './substrate-lib'
import { DeveloperConsole } from './substrate-lib/components'

import AccountSelector from './AccountSelector'
import Agreements from './Agreements'
import BlockNumber from './BlockNumber'
import Events from './Events'
import Interactor from './Interactor'
import Market from './market/Market'
import Metadata from './Metadata'
import NodeInfo from './NodeInfo'

function Main() {
  const { apiState, apiError, keyringState } = useSubstrateState()

  const loader = text => (
    <Dimmer active>
      <Loader size="small">{text}</Loader>
    </Dimmer>
  )

  const message = errObj => (
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message
          negative
          compact
          floating
          header="Error Connecting to aimosphere"
          content={`Connection to websocket '${errObj.target.url}' failed.`}
        />
      </Grid.Column>
    </Grid>
  )

  if (apiState === 'ERROR') return message(apiError)
  else if (apiState !== 'READY') return loader('Connecting to aimosphere')

  if (keyringState !== 'READY') {
    return loader("Loading accounts (please review any extension's authorization)")
  }

  const contextRef = createRef()
  const panes = [
    {
      menuItem: { key: 'orders', icon: 'cart plus', content: 'Top Up' },
      render: () => (
        <Tab.Pane>
          <Market />
        </Tab.Pane>
      ),
    },
    {
      menuItem: { key: 'agreements', icon: 'cogs', content: 'Execute' },
      render: () => (
        <Tab.Pane>
          <Agreements />
        </Tab.Pane>
      ),
    },
  ]

  return (
    <div ref={contextRef}>
      <Sticky context={contextRef}>
        <AccountSelector />
      </Sticky>
      <Container>
        <Grid stackable columns="equal">
          <Grid.Row stretched>
            <Grid.Column>
              <NodeInfo />
            </Grid.Column>
            <Grid.Column>
              <Metadata />
            </Grid.Column>
            <Grid.Column>
              <BlockNumber />
            </Grid.Column>
            <Grid.Column>
              <BlockNumber finalized />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Interactor />
            </Grid.Column>
            <Grid.Column>
              <Events />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Tab panes={panes} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
      <DeveloperConsole />
    </div>
  )
}

export default function App() {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  )
}
