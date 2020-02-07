import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { EtherscanLink } from 'decentraland-dapps/dist/containers'
import { Form, CheckboxProps, Radio, Loader, Popup } from 'decentraland-ui'
import {
  contractSymbols,
  getContractName
} from '../../../modules/contract/utils'
import { locations } from '../../../modules/routing/locations'
import { hasTransactionPending } from '../../../modules/transaction/utils'
import { Props } from './Authorization.types'
import './Authorization.css'

const Authorizations = (props: Props) => {
  const {
    checked,
    tokenContractAddress,
    contractAddress,
    pendingTransactions,
    onChange
  } = props

  const contractName = getContractName(contractAddress)

  const handleOnChange = useCallback(
    (tokenContractAddress: string, isChecked: boolean) =>
      onChange(isChecked, contractAddress, tokenContractAddress),
    [contractAddress, onChange]
  )

  return (
    <div className="Authorization">
      <Form.Field
        key={tokenContractAddress}
        className={
          hasTransactionPending(
            pendingTransactions,
            contractAddress,
            tokenContractAddress
          )
            ? 'is-pending'
            : ''
        }
      >
        <Popup
          content={t('settings_page.pending_tx')}
          position="top left"
          trigger={
            <Link to={locations.activity()} className="loader-tooltip">
              <Loader active size="mini" />
            </Link>
          }
        />
        <Radio
          checked={checked}
          label={t(
            `settings_page.authorization_${contractName}_${getContractName(
              tokenContractAddress
            )}`,
            { token: contractSymbols[tokenContractAddress] }
          )}
          onClick={(_, data: CheckboxProps) =>
            handleOnChange(tokenContractAddress, !!data.checked)
          }
        />
        <div className="radio-description secondary-text">
          <T
            id="authorization.authorize"
            values={{
              contract_link: (
                <EtherscanLink address={contractAddress} txHash="">
                  {contractName}
                </EtherscanLink>
              ),
              symbol: contractSymbols[tokenContractAddress]
            }}
          />
        </div>
      </Form.Field>
    </div>
  )
}

export default React.memo(Authorizations)
