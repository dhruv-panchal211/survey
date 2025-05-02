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
import CreateOptionsScreen from '@/screens/CreateOptionsScreen';
import CreateTCScreen from '@/screens/CreateTCScreen';
import CreatePollScreen from '@/screens/CreatePollScreen';
import AddMaterialScreen from '@/screens/AddMaterialScreen';

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
          <Stack.Screen
            name="PollForm"
            component={PollFormScreen}
            options={{ title: 'New Poll' }}
          />
          <Stack.Screen
            name="CreateOptions"
            component={CreateOptionsScreen}
            options={{ title: 'Choose Action' }}
          />
          <Stack.Screen
            name="CreateTC"
            component={CreateTCScreen}
            options={{ title: 'Create TC' }}
          />
          <Stack.Screen
            name="CreatePoll"
            component={CreatePollScreen}
            options={{ title: 'Create Poll' }}
          />
          <Stack.Screen
            name="TCNumber"
            component={TCNumberScreen}
            options={{ title: 'TC Number' }}
          />
          <Stack.Screen
            name="AddMaterial"
            component={AddMaterialScreen}
            options={{ title: 'Add Material' }}
          />
          <Stack.Screen
            name="Wizard"
            component={WizardScreen}
            options={{ title: 'Poll Details' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
