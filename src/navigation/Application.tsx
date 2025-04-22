import type { RootStackParamList } from '@/navigation/types';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';

import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import PollFormScreen from '@/screens/PollFormScreen';
import TCNumberScreen from '@/screens/TCNumberScreen';
import WizardScreen from '@/screens/WizardScreen';

const Stack = createStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  const { navigationTheme, variant } = useTheme();

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator key={variant} screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen component={Startup} name={Paths.Startup} /> */}
          {/* <Stack.Screen component={Example} name={Paths.Example} /> */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="PollForm" component={PollFormScreen} options={{ title: 'New Poll' }} />
          <Stack.Screen name="TCNumber" component={TCNumberScreen} options={{ title: 'TC Number' }} />
          <Stack.Screen name="Wizard" component={WizardScreen} options={{ title: 'Poll Details' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
