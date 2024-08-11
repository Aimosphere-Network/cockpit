import React from 'react'
import { Table } from 'semantic-ui-react'

import { useSubstrateState } from '../substrate-lib'

export default function Main({ agreements, selectedAgreementId, onAgreementSelected }) {
  const { keyring } = useSubstrateState()

  return (
    <Table selectable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell>Provider</Table.HeaderCell>
          <Table.HeaderCell>Model</Table.HeaderCell>
          <Table.HeaderCell>Requests</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {Object.keys(agreements).map(agreementId => (
          <Table.Row
            key={agreementId}
            active={selectedAgreementId === agreementId}
            onClick={() => onAgreementSelected(agreementId, agreements[agreementId].modelId)}
          >
            <Table.Cell>{agreementId}</Table.Cell>
            <Table.Cell>
              {keyring.getPairs().find(account => account.address === agreements[agreementId].provider.toHuman())?.meta
                .name || agreements[agreementId].provider.toHuman()}
            </Table.Cell>
            <Table.Cell>{agreements[agreementId].modelId.toHuman()}</Table.Cell>
            <Table.Cell>
              {agreements[agreementId].requestsCount.toHuman()}/{agreements[agreementId].requestsTotal.toHuman()}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
