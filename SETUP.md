# Plate Race — PTT Prototype Setup

## What this tests
- Hold-to-talk button feel on a real Android device
- Mic access and voice recognition via @react-native-voice/voice
- Button press timestamp (the claim moment)
- Haptic feedback on press and release
- Win/loss feedback (randomized here — Firebase resolves this in the real game)

---

## Setup steps

### 1. Create a new React Native project
```bash
npx react-native init PlateRacePTT
cd PlateRacePTT
```

### 2. Copy in these files
- Replace `App.js` with the one provided
- Create `src/PTTScreen.js` with the file provided

### 3. Install the voice library
```bash
npm install @react-native-voice/voice
```

### 4. Android permissions
Add to `android/app/src/main/AndroidManifest.xml` inside the `<manifest>` tag:
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

### 5. Link (if React Native < 0.70)
```bash
npx react-native link @react-native-voice/voice
```

### 6. Run on device (not emulator — mic works better on real hardware)
```bash
npx react-native run-android
```

---

## What to validate on your Android device
1. Does the button feel snappy? No lag between press and haptic?
2. Does the mic activate reliably every time?
3. Does it correctly hear US state names?
4. Does releasing the button feel clean?
5. Is the pulse animation smooth?

If all five feel good — React Native is your stack. Ship it.

---

## Known limitations of this prototype
- Claim win/loss is randomized (no Firebase yet)
- No session or room code
- State matching is exact string match (production needs fuzzy matching)
- No Google Speech-to-Text yet — uses on-device recognition via @react-native-voice
