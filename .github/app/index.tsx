import { Redirect } from 'expo-router';

// Expo Router needs this file — it redirects to the main layout
export default function Index() {
  return <Redirect href="/" />;
}
