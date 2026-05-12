import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Vibration,
  Platform,
  Alert,
} from 'react-native';

// ─────────────────────────────────────────────
// INSTALL THESE before running:
//   npm install @react-native-voice/voice
//   npx pod-install (iOS only)
//
// Android: add to AndroidManifest.xml:
//   <uses-permission android:name="android.permission.RECORD_AUDIO" />
// ─────────────────────────────────────────────
import Voice from '@react-native-voice/voice';

const COLORS = {
  bg: '#0D1117',
  surface: '#161B22',
  border: '#30363D',
  blue: '#378ADD',
  blueDark: '#185FA5',
  blueLight: '#B5D4F4',
  green: '#3FB950',
  greenBg: '#122119',
  red: '#F85149',
  redBg: '#2D1117',
  textPrimary: '#E6EDF3',
  textSecondary: '#8B949E',
};

export default function PTTScreen() {
  const [isListening, setIsListening] = useState(false);
  const [lastHeard, setLastHeard] = useState(null);
  const [claimResult, setClaimResult] = useState(null); // 'won' | 'lost' | null
  const [pressTimestamp, setPressTimestamp] = useState(null);

  // Animation values
  const buttonScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef(null);

  // ── Voice setup ──────────────────────────────
  React.useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = (e) => {
    const spoken = e.value?.[0] ?? '';
    setLastHeard(spoken);
    // In the real game, you'd match this against US state names
    const recognized = matchState(spoken);
    if (recognized) {
      setLastHeard(recognized);
    }
  };

  const onSpeechError = (e) => {
    console.log('Speech error:', e);
    setLastHeard('(not heard — try again)');
  };

  // ── State name matching (simple fuzzy) ───────
  const US_STATES = [
    'Alabama','Alaska','Arizona','Arkansas','California','Colorado',
    'Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho',
    'Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana',
    'Maine','Maryland','Massachusetts','Michigan','Minnesota',
    'Mississippi','Missouri','Montana','Nebraska','Nevada',
    'New Hampshire','New Jersey','New Mexico','New York',
    'North Carolina','North Dakota','Ohio','Oklahoma','Oregon',
    'Pennsylvania','Rhode Island','South Carolina','South Dakota',
    'Tennessee','Texas','Utah','Vermont','Virginia','Washington',
    'West Virginia','Wisconsin','Wyoming',
  ];

  const matchState = (spoken) => {
    const lower = spoken.toLowerCase();
    return US_STATES.find(s => s.toLowerCase() === lower) ?? null;
  };

  // ── Button press handlers ─────────────────────
  const handlePressIn = async () => {
    // 1. Timestamp the press immediately (this is the claim moment)
    const ts = Date.now();
    setPressTimestamp(ts);
    setClaimResult(null);
    setLastHeard(null);

    // 2. Haptic feedback
    Vibration.vibrate(40);

    // 3. Animate button down
    Animated.spring(buttonScale, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 50,
    }).start();

    // 4. Start pulse animation
    pulseLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    pulseLoop.current.start();

    // 5. Start voice recognition
    setIsListening(true);
    try {
      await Voice.start('en-US');
    } catch (e) {
      Alert.alert('Mic error', 'Could not start voice recognition. Check mic permissions.');
      setIsListening(false);
    }
  };

  const handlePressOut = async () => {
    // Stop listening
    setIsListening(false);
    try {
      await Voice.stop();
    } catch (e) {}

    // Stop animations
    pulseLoop.current?.stop();
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Simulate claim result (in real game, Firebase resolves this)
    // Here we randomly win/lose to test the feedback
    const won = Math.random() > 0.4;
    setClaimResult(won ? 'won' : 'lost');
    Vibration.vibrate(won ? [0, 40, 60, 80] : [0, 200]);
  };

  // ── Derived UI state ──────────────────────────
  const buttonBg = isListening ? COLORS.blueDark : COLORS.blue;
  const resultColor = claimResult === 'won' ? COLORS.green : COLORS.red;
  const resultBg = claimResult === 'won' ? COLORS.greenBg : COLORS.redBg;
  const resultText = claimResult === 'won' ? '✓ You got it!' : '✗ Too slow!';

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>Plate Race</Text>
        <Text style={styles.subtitle}>PTT Prototype</Text>
      </View>

      {/* Status card */}
      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>
          {isListening ? '🎙 Listening...' : 'Hold button to claim a plate'}
        </Text>
        {lastHeard && (
          <Text style={styles.heardText}>
            Heard: <Text style={{ color: COLORS.textPrimary }}>{lastHeard}</Text>
          </Text>
        )}
        {pressTimestamp && (
          <Text style={styles.tsText}>
            Button pressed at: {new Date(pressTimestamp).toISOString().slice(11, 23)}
          </Text>
        )}
      </View>

      {/* Claim result */}
      {claimResult && (
        <View style={[styles.resultCard, { backgroundColor: resultBg, borderColor: resultColor }]}>
          <Text style={[styles.resultText, { color: resultColor }]}>{resultText}</Text>
          <Text style={styles.resultSub}>
            {claimResult === 'won'
              ? 'Timestamp sent to Firebase ✓'
              : 'Another player was faster'}
          </Text>
        </View>
      )}

      {/* PTT Button */}
      <View style={styles.buttonContainer}>
        {/* Pulse ring */}
        {isListening && (
          <Animated.View
            style={[
              styles.pulseRing,
              { transform: [{ scale: pulseAnim }], opacity: 0.35 },
            ]}
          />
        )}

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.pttButton, { backgroundColor: buttonBg }]}
          >
            <Text style={styles.pttIcon}>{isListening ? '🎙' : '📍'}</Text>
            <Text style={styles.pttLabel}>
              {isListening ? 'LISTENING' : 'HOLD TO\nCALL IT'}
            </Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* Instructions */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Hold → speak a US state name → release{'\n'}
          Button press is timestamped immediately
        </Text>
      </View>

    </View>
  );
}

const BTN_SIZE = 200;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statusCard: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 6,
  },
  statusLabel: {
    fontSize: 15,
    color: COLORS.blueLight,
    fontWeight: '500',
  },
  heardText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  tsText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  resultCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 4,
  },
  resultText: {
    fontSize: 17,
    fontWeight: '700',
  },
  resultSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: BTN_SIZE + 80,
    height: BTN_SIZE + 80,
  },
  pulseRing: {
    position: 'absolute',
    width: BTN_SIZE + 40,
    height: BTN_SIZE + 40,
    borderRadius: (BTN_SIZE + 40) / 2,
    backgroundColor: COLORS.blue,
  },
  pttButton: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: BTN_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: COLORS.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  pttIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  pttLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 1,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
