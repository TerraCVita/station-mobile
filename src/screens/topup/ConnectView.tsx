import React, { ReactElement, useEffect, useState } from 'react'
import {
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { Buffer } from 'buffer'
import { useAuth } from 'use-station/src'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Button, Icon, Text } from 'components'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import color from 'styles/color'
import {
  DEBUG_TOPUP,
  gotoDashboard,
  gotoWallet,
  restoreApp,
} from './TopupUtils'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParams } from 'types'

type Props = StackScreenProps<RootStackParams, 'ConnectView'>

interface SchemeArgs {
  return_scheme: string
  endpoint_address: string
}

const ConnectView = (props: Props): ReactElement => {
  const { user } = useAuth()
  const insets = useSafeAreaInsets()

  useEffect(() => {
    if (user === undefined) {
      Alert.alert('Error', 'Wallet not connected!', [
        {
          text: 'OK',
          onPress: (): void => gotoWallet(props.navigation),
        },
      ])
    }
  }, [])

  const [returnScheme, setReturnScheme] = useState('')
  const [endpointAddress, setEndpointAddress] = useState('')

  const [loading, setLoading] = useState<boolean>(false)
  const [arg, setArg] = useState<SchemeArgs | undefined>(undefined)
  try {
    if (props.route.params.arg !== undefined) {
      setArg(
        JSON.parse(
          Buffer.from(props.route.params.arg, 'base64').toString()
        )
      )
      props.route.params.arg = undefined
    }
  } catch (e) {
    Alert.alert(e.toString())
  }

  useEffect(() => {
    if (arg !== undefined) {
      setEndpointAddress(arg.endpoint_address)
      setReturnScheme(arg.return_scheme)
    } else {
      Alert.alert('Parameter error', 'Argument is null', [
        {
          text: 'OK',
          onPress: (): void => gotoDashboard(props.navigation),
        },
      ])
    }
  }, [arg])

  const putConnect = async (
    url: string,
    address?: string
  ): Promise<Response> => {
    const init = {
      method: 'PUT',
      headers: {
        Origin: 'https://topup.terra.dev',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    }

    return await fetch(url, init)
  }

  const processConnect = async (): Promise<void> => {
    try {
      setLoading(true)
      const ret = await putConnect(endpointAddress, user?.address)

      if (ret.status !== 200) {
        Alert.alert(
          `${ret.status} error`,
          JSON.stringify(await ret.json())
        )
      } else {
        restoreApp(props.navigation, returnScheme)
      }
    } catch (e) {
      Alert.alert('Unexpected Error', e.toString())
    } finally {
      setLoading(false)
    }
  }

  return (
    <View
      style={[
        style.container,
        {
          marginTop: insets.top,
          marginBottom: insets.bottom,
        },
      ]}
    >
      <View style={style.closeView}>
        <TouchableOpacity
          onPress={(): void => gotoDashboard(props.navigation)}
        >
          <Icon name="close" color={color.sapphire} size={24} />
        </TouchableOpacity>
      </View>
      <View style={style.contentView}>
        <Icon
          name="account-balance-wallet"
          color={color.sapphire}
          size={60}
        />
        <Text fontType="bold" style={style.titleText}>
          {'Allow Access to wallet'}
        </Text>
        {user?.address && (
          <Text fontType="book" style={style.contentText}>
            {`CHAI wants to access “${
              user?.name
            } - ${user?.address.substring(
              0,
              6
            )}...${user?.address.substr(user?.address.length - 5)}”`}
          </Text>
        )}
        {DEBUG_TOPUP && (
          <View style={style.debugContainer}>
            <Text
              style={style.debugText}
            >{`address: ${user?.address}`}</Text>
            <Text
              style={style.debugText}
            >{`returnScheme: ${returnScheme}`}</Text>
            <Text
              style={style.debugText}
            >{`endpointAddress: ${endpointAddress}`}</Text>
          </View>
        )}
      </View>
      <View style={style.buttonView}>
        <Button
          title={'Allow'}
          theme={'sapphire'}
          containerStyle={style.buttonContainer}
          titleStyle={style.buttonTitle}
          titleFontType={'medium'}
          onPress={(): void => {
            processConnect()
          }}
        />
        <View style={{ marginHorizontal: 5 }} />
        <Button
          title={'Deny'}
          theme={'red'}
          containerStyle={style.buttonContainer}
          titleStyle={style.buttonTitle}
          titleFontType={'medium'}
          onPress={(): void => {
            restoreApp(props.navigation, returnScheme)
          }}
        />
      </View>
      {loading && (
        <View style={style.loadingView}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  closeView: {
    marginVertical: 18,
    marginLeft: 20,
  },
  contentView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonTitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  loadingView: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    alignContent: 'center',
    justifyContent: 'center',
  },

  titleText: { fontSize: 24, lineHeight: 36 },
  contentText: { fontSize: 16, lineHeight: 24 },

  debugContainer: { alignSelf: 'flex-start' },
  debugText: { marginBottom: 4 },

  buttonContainer: { flex: 1, height: 60 },
})

export default ConnectView
