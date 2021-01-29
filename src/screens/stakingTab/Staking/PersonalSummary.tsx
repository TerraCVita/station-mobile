import React, { ReactElement } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

import { StakingPersonal, User } from 'use-station/src'

import { Button, Icon, Number, Text } from 'components'
import color from 'styles/color'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'
import { RootStackParams } from 'types'
import { useWithdraw } from 'hooks/useWithdraw'

const NotStaked = (): ReactElement => {
  const { navigate } = useNavigation<
    NavigationProp<RootStackParams>
  >()

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}
          onPress={(): void => {
            navigate('StakingInformation')
          }}
        >
          <Text style={styles.headerTitle} fontType={'bold'}>
            Staking rewards
          </Text>
          <Icon
            color={color.sapphire}
            name={'info'}
            size={16}
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
      </View>
      <Text>
        {
          "You haven't staked any assets yet. Stake your Luna and stack up rewards."
        }
      </Text>
    </>
  )
}

const PersonalSummary = ({
  user,
  personal,
}: {
  user: User
  personal: StakingPersonal
}): ReactElement => {
  const {
    delegated,
    undelegated,
    rewards,
    myDelegations,
    myRewards,
    withdrawAll,
  } = personal
  const { navigate } = useNavigation<
    NavigationProp<RootStackParams>
  >()
  const { runWithdraw } = useWithdraw({
    user,
    amounts: withdrawAll.amounts,
  })
  return (
    <View style={styles.container}>
      {myDelegations || myRewards ? (
        <>
          <View style={styles.header}>
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.headerTitle} fontType={'bold'}>
                Summary
              </Text>
            </View>

            <TouchableOpacity
              onPress={(): void => {
                navigate('StakingPersonal')
              }}
            >
              <Icon
                name={'arrow-forward'}
                color={color.sapphire}
                size={24}
              />
            </TouchableOpacity>
          </View>
          <View style={{ marginBottom: 10 }}>
            {rewards && (
              <View style={styles.itemBox}>
                <Text>{rewards.title}</Text>
                <Number
                  numberFontStyle={{ fontSize: 14 }}
                  {...rewards.display}
                  estimated
                />
              </View>
            )}
            {delegated && (
              <View style={styles.itemBox}>
                <Text>{delegated.title}</Text>
                <Number
                  numberFontStyle={{ fontSize: 14 }}
                  {...delegated.display}
                />
              </View>
            )}
            {undelegated && undelegated.table && (
              <View style={styles.itemBox}>
                <Text>{undelegated.title}</Text>
                <Number
                  numberFontStyle={{ fontSize: 14 }}
                  {...undelegated.display}
                />
              </View>
            )}
          </View>

          <Button
            title={withdrawAll.attrs.children}
            theme={'gray'}
            disabled={withdrawAll.attrs.disabled}
            onPress={(): void => {
              runWithdraw()
            }}
          />
        </>
      ) : (
        <NotStaked />
      )}
    </View>
  )
}

export default PersonalSummary

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 20,
    backgroundColor: color.white,
    borderRadius: 20,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 35,
    shadowOpacity: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  itemBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
})
