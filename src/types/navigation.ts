import { createStackNavigator } from '@react-navigation/stack'
import { ChartKey } from '@terra-money/use-native-station'

/* Root */
export type RootStackParams = {
  OnBoarding: undefined
  Tabs: undefined
  Setting: undefined
  AuthMenu: undefined
  SelectWallet: undefined
  New: undefined
  Add: undefined
  ConnectView: undefined
  SendTxView: undefined
}

export const RootStack = createStackNavigator<RootStackParams>()

/* Tabs */
export type TabsStackParams = {
  Dashboard: undefined
  Market: undefined
}

export const TabsStack = createStackNavigator<TabsStackParams>()

/* Dashboard */
export type DashboardRouteParams = {
  Dashboard: undefined
  Chart: { chartKey: ChartKey }
}

/* Staking */
export type StakingRouteParams = {
  ValidatorDetail: { address: string }
}

/* Governance */
export type GovernanceRouteParams = {
  Governance: undefined
  Proposal: { id: string }
}
