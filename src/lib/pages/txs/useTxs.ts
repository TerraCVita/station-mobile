import { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { isTxError } from '@terra-money/terra.js'
import _ from 'lodash'

import { TxsPage, User, Tx, TxUI } from '../../types'
import { format } from '../../utils'
import useFCD from '../../api/useFCD'
import { useConfig } from '../../contexts/ConfigContext'
import useFinder from '../../hooks/useFinder'
import useParseTxText from './useParseTxText'
import {
  createActionRuleSet,
  createLogMatcherForActions,
  getTxCanonicalMsgs,
} from '../../../ruleset'
import { Action } from 'ruleset/types'

interface Response {
  txs: Tx[]
  limit: number
  next: number
}

export default ({ address }: User): TxsPage => {
  const { t } = useTranslation()
  const getLink = useFinder()
  const { chain } = useConfig()
  const { name: currentChain } = chain.current
  const parseTxText = useParseTxText()

  /* api */
  const [txs, setTxs] = useState<Tx[]>([])
  const [next, setNext] = useState<number>()
  const [offset, setOffset] = useState<number>()
  const [done, setDone] = useState(false)

  const url = '/v1/txs'
  const params = { account: address, offset }
  const response = useFCD<Response>({ url, params })
  const { data } = response

  useEffect(() => {
    if (data) {
      setTxs((txs) => [...txs, ...data.txs])
      setNext(data.next)
      setDone(data.txs.length < data.limit)
    }
  }, [data])

  const more =
    txs.length && !done ? (): void => setOffset(next) : undefined

  /* parse */
  const ruleset = createActionRuleSet(currentChain)
  const logMatcher = createLogMatcherForActions(ruleset)

  const getCanonicalMsgs = (tx: Tx): Action[] => {
    const matchedMsg = getTxCanonicalMsgs(
      JSON.stringify(tx),
      logMatcher
    )

    if (matchedMsg) {
      const flatted = matchedMsg
        .map((matchedLog) =>
          matchedLog.map(({ transformed }) => transformed)
        )
        .flat(2)

      const filtered: Action[] = []
      _.forEach(flatted, (x) => {
        if (x) {
          filtered.push(x)
        }
      })

      return filtered
    }

    return []
  }

  const list: TxUI[] = useMemo(
    () =>
      txs.map((txItem) => {
        const { txhash, chainId, timestamp, raw_log, tx } = txItem
        const { fee, memo } = tx.value

        const success = !isTxError(txItem)
        const msgs = getCanonicalMsgs(txItem)
        const successMessage =
          msgs.length > 0
            ? msgs.map((msg) => {
                const tag = msg.msgType
                  .split('/')[1]
                  .replace(/-/g, ' ')
                const summary = msg.canonicalMsg.map(parseTxText)

                return { tag, summary, success }
              })
            : [
                {
                  tag: 'Unknown',
                  summary: ['Unknown tx'],
                  success,
                },
              ]
        const messages = success
          ? successMessage
          : [{ tag: 'Failed', summary: [raw_log], success }]

        return {
          link: getLink({
            network: chainId,
            q: 'tx',
            v: txhash,
          }),
          hash: txhash,
          date: format.date(timestamp, { toLocale: true }),
          messages,
          details: [
            {
              title: t('Common:Tx:Tx fee'),
              content: fee.amount
                ?.map((coin) => format.coin(coin))
                .join(', '),
            },
            { title: t('Common:Tx:Memo'), content: memo },
          ].filter(({ content }) => !!content),
        }
      }),
    [txs]
  )

  /* render */
  const ui =
    !response.loading && !txs.length
      ? {
          card: {
            title: t('Page:Txs:No transaction history'),
            content: t(
              "Page:Txs:Looks like you haven't made any transaction yet"
            ),
          },
        }
      : { more, list }

  return { ...response, ui }
}
