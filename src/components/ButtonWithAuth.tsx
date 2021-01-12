import React, { FC } from 'react'
import { Text } from 'react-native'
import { useAuth, useText } from '@terra-money/use-native-station'

/* Show tooltip if user can't use this button */
const ButtonWithAuth: FC<{ onPress: () => void }> = ({
  children,
}) => {
  const { user } = useAuth()
  const { WITH_AUTH } = useText()

  return user?.name || user?.ledger ? (
    <Text>{children}</Text>
  ) : (
    <>
      <Text>{WITH_AUTH}</Text>
      <Text>{children}</Text>
    </>
  )
}

export default ButtonWithAuth
