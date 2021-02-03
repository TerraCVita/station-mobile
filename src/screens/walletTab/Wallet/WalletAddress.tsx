import React, { ReactElement } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { User } from 'use-station/src'
import { CopyButton } from 'components'
import color from 'styles/color'

const WalletAddress = ({ user }: { user: User }): ReactElement => {
  return (
    <View style={styles.container}>
      <Text
        style={styles.userAddress}
        numberOfLines={1}
        ellipsizeMode={'middle'}
      >
        {user.address}
      </Text>
      <View>
        <CopyButton copyString={user.address} theme={'sapphire'} />
      </View>
    </View>
  )
}

export default WalletAddress

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: color.sapphire,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 35,
    shadowOpacity: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  userAddress: {
    fontSize: 13,
    fontFamily: 'Gotham-Book',
    color: '#ffffff',
    flex: 1,
    paddingRight: 10,
  },
})
