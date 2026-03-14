import React, {useState, useCallback, useEffect} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  useColorScheme,
} from 'react-native';

import HapticFeedback, {
  HapticFeedbackTypes,
  TouchableHaptic,
  pattern,
  Patterns,
  playHaptic,
  useHaptics,
  getSystemHapticStatus,
} from 'react-native-haptic-feedback';
import type {HapticOptions, SystemHapticStatus} from 'react-native-haptic-feedback';

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_OPTIONS: HapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

type HapticEntry = {label: string; type: HapticFeedbackTypes};
type HapticGroup = {title: string; entries: HapticEntry[]};

const HAPTIC_GROUPS: HapticGroup[] = [
  {
    title: 'Impact',
    entries: [
      {label: 'Light', type: HapticFeedbackTypes.impactLight},
      {label: 'Medium', type: HapticFeedbackTypes.impactMedium},
      {label: 'Heavy', type: HapticFeedbackTypes.impactHeavy},
      {label: 'Rigid', type: HapticFeedbackTypes.rigid},
      {label: 'Soft', type: HapticFeedbackTypes.soft},
    ],
  },
  {
    title: 'Notification',
    entries: [
      {label: 'Success', type: HapticFeedbackTypes.notificationSuccess},
      {label: 'Warning', type: HapticFeedbackTypes.notificationWarning},
      {label: 'Error', type: HapticFeedbackTypes.notificationError},
    ],
  },
  {
    title: 'Selection',
    entries: [{label: 'Selection', type: HapticFeedbackTypes.selection}],
  },
  {
    title: 'Device Feedback',
    entries: [
      {label: 'Clock Tick', type: HapticFeedbackTypes.clockTick},
      {label: 'Context Click', type: HapticFeedbackTypes.contextClick},
      {label: 'Keyboard Press', type: HapticFeedbackTypes.keyboardPress},
      {label: 'Keyboard Release', type: HapticFeedbackTypes.keyboardRelease},
      {label: 'Keyboard Tap', type: HapticFeedbackTypes.keyboardTap},
      {label: 'Long Press', type: HapticFeedbackTypes.longPress},
      {label: 'Text Handle', type: HapticFeedbackTypes.textHandleMove},
      {label: 'Virtual Key', type: HapticFeedbackTypes.virtualKey},
      {label: 'Virtual Key ↑', type: HapticFeedbackTypes.virtualKeyRelease},
    ],
  },
  {
    title: 'Android Effects',
    entries: [
      {label: 'Click', type: HapticFeedbackTypes.effectClick},
      {label: 'Double Click', type: HapticFeedbackTypes.effectDoubleClick},
      {label: 'Heavy Click', type: HapticFeedbackTypes.effectHeavyClick},
      {label: 'Tick', type: HapticFeedbackTypes.effectTick},
    ],
  },
  {
    title: 'Android API 30+',
    entries: [
      {label: 'Confirm', type: HapticFeedbackTypes.confirm},
      {label: 'Reject', type: HapticFeedbackTypes.reject},
      {label: 'Gesture Start', type: HapticFeedbackTypes.gestureStart},
      {label: 'Gesture End', type: HapticFeedbackTypes.gestureEnd},
      {label: 'Segment Tick', type: HapticFeedbackTypes.segmentTick},
      {label: 'Seg. Freq. Tick', type: HapticFeedbackTypes.segmentFrequentTick},
      {label: 'Toggle On', type: HapticFeedbackTypes.toggleOn},
      {label: 'Toggle Off', type: HapticFeedbackTypes.toggleOff},
    ],
  },
];

const AHAP_FILES = [
  {name: 'heartbeat', file: 'heartbeat.ahap', fallback: pattern('oO'), description: 'lub-dub double pulse'},
  {name: 'rumble', file: 'rumble.ahap', fallback: pattern('O=O'), description: 'continuous fade-out'},
  {name: 'celebration', file: 'celebration.ahap', fallback: pattern('o.o.o.O'), description: 'ascending burst'},
];

const PRESET_NOTATIONS: Record<string, string> = {
  success: 'oO.O',
  error: 'OO.OO',
  warning: 'O.O',
  heartbeat: 'oO--oO',
  tripleClick: 'o.o.o',
  notification: 'o-O=o',
};

const PATTERN_KEYS = [
  {char: 'o', display: 'o', hint: 'soft'},
  {char: 'O', display: 'O', hint: 'strong'},
  {char: '.', display: '·', hint: '100ms'},
  {char: '-', display: '—', hint: '300ms'},
  {char: '=', display: '≡', hint: '1 s'},
];

// ─── Components ───────────────────────────────────────────────────────────────

function Badge({label, color}: {label: string; color: string}) {
  return (
    <View style={[styles.badge, {backgroundColor: color + '22', borderColor: color}]}>
      <Text style={[styles.badgeText, {color}]}>{label}</Text>
    </View>
  );
}

function SectionCard({title, children, cardBg, titleColor}: {title: string; children: React.ReactNode; cardBg: string; titleColor: string}) {
  return (
    <View style={[styles.card, {backgroundColor: cardBg}]}>
      <Text style={[styles.cardTitle, {color: titleColor}]}>{title}</Text>
      {children}
    </View>
  );
}

function PatternPreview({notation, textColor}: {notation: string; textColor: string}) {
  return (
    <Text style={styles.patternLine}>
      {notation.split('').map((ch, i) => {
        let color = textColor;
        if (ch === 'o') color = '#60a5fa';
        else if (ch === 'O') color = '#818cf8';
        else if (['.', '-', '='].includes(ch)) color = '#f59e0b';
        return (
          <Text key={i} style={[styles.patternChar, {color}]}>
            {ch}
          </Text>
        );
      })}
    </Text>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App(): React.JSX.Element {
  const isDark = useColorScheme() === 'dark';
  const bg = isDark ? '#0f172a' : '#f1f5f9';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textSecondary = isDark ? '#94a3b8' : '#64748b';
  const keyBg = isDark ? '#1e293b' : '#f8fafc';
  const keyBorder = isDark ? '#334155' : '#e2e8f0';

  const [status, setStatus] = useState<SystemHapticStatus | null>(null);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [patternStr, setPatternStr] = useState('');
  const [lastPlayed, setLastPlayed] = useState('');

  // useHaptics hook demo — shared instance with default options
  const haptics = useHaptics(DEFAULT_OPTIONS);

  useEffect(() => {
    getSystemHapticStatus().then(setStatus).catch(() => {});
  }, []);

  const toggleEnabled = useCallback(() => {
    const next = !hapticsEnabled;
    HapticFeedback.setEnabled(next);
    setHapticsEnabled(next);
  }, [hapticsEnabled]);

  const appendKey = useCallback((char: string) => {
    HapticFeedback.trigger(HapticFeedbackTypes.clockTick, DEFAULT_OPTIONS);
    setPatternStr(prev => prev + char);
  }, []);

  const backspace = useCallback(() => {
    HapticFeedback.trigger(HapticFeedbackTypes.keyboardRelease, DEFAULT_OPTIONS);
    setPatternStr(prev => prev.slice(0, -1));
  }, []);

  const clearPattern = useCallback(() => {
    setPatternStr('');
    setLastPlayed('');
  }, []);

  const playPattern = useCallback(() => {
    const events = pattern(patternStr);
    if (events.length === 0) return;
    setLastPlayed(patternStr);
    HapticFeedback.triggerPattern(events, DEFAULT_OPTIONS);
  }, [patternStr]);

  const playPreset = useCallback((name: string) => {
    const events = Patterns[name as keyof typeof Patterns];
    if (!events) return;
    setLastPlayed(`${name}  "${PRESET_NOTATIONS[name]}"`);
    HapticFeedback.triggerPattern(events, DEFAULT_OPTIONS);
  }, []);

  const patternEvents = patternStr ? pattern(patternStr) : [];
  const canPlay = patternStr.length > 0 && patternEvents.length > 0;

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: bg}]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{backgroundColor: bg}}
        contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={[styles.card, {backgroundColor: cardBg}]}>
          <Text style={[styles.heading, {color: textPrimary}]}>Haptic Feedback</Text>
          <Text style={[styles.subheading, {color: textSecondary}]}>react-native-haptic-feedback demo</Text>
          {status ? (
            <View style={styles.badgeRow}>
              <Badge
                label={status.vibrationEnabled ? '✓ Vibration on' : '✗ Vibration off'}
                color={status.vibrationEnabled ? '#22c55e' : '#ef4444'}
              />
              {status.ringerMode !== null && (
                <Badge label={`Ringer: ${status.ringerMode}`} color="#6366f1" />
              )}
              <Badge
                label={HapticFeedback.isSupported() ? '✓ Haptics supported' : '✗ Not supported'}
                color={HapticFeedback.isSupported() ? '#22c55e' : '#f59e0b'}
              />
            </View>
          ) : (
            <Text style={[styles.hint, {color: textSecondary}]}>Checking system status…</Text>
          )}
        </View>

        {/* Global enable/disable toggle */}
        <SectionCard title="Global Enable / Disable" cardBg={cardBg} titleColor={textSecondary}>
          <Text style={[styles.hint, {color: textSecondary, marginBottom: 10}]}>
            setEnabled() / isEnabled() — library-wide kill switch. Useful for in-app haptics preference.
          </Text>
          <Pressable
            style={({pressed}) => [
              styles.toggleBtn,
              {backgroundColor: hapticsEnabled ? '#22c55e' : '#ef4444'},
              pressed && styles.pressed,
            ]}
            onPress={toggleEnabled}>
            <Text style={styles.toggleBtnText}>
              Haptics: {hapticsEnabled ? 'ENABLED' : 'DISABLED'}
            </Text>
          </Pressable>
        </SectionCard>

        {/* All haptic types */}
        {HAPTIC_GROUPS.map(group => (
          <SectionCard key={group.title} title={group.title} cardBg={cardBg} titleColor={textSecondary}>
            <View style={styles.chipWrap}>
              {group.entries.map(({label, type}) => (
                <TouchableHaptic
                  key={type}
                  hapticType={type}
                  hapticTrigger="onPress"
                  hapticOptions={DEFAULT_OPTIONS}
                  style={({pressed}) => [styles.chip, pressed && styles.pressed]}>
                  <Text style={styles.chipText}>{label}</Text>
                </TouchableHaptic>
              ))}
            </View>
          </SectionCard>
        ))}

        {/* useHaptics hook demo */}
        <SectionCard title="useHaptics Hook" cardBg={cardBg} titleColor={textSecondary}>
          <Text style={[styles.hint, {color: textSecondary, marginBottom: 10}]}>
            Shared hook instance with merged default options. Methods are stable across renders.
          </Text>
          <View style={styles.chipWrap}>
            {(['impactLight', 'impactMedium', 'impactHeavy'] as const).map(type => (
              <Pressable
                key={type}
                style={({pressed}) => [styles.chip, styles.chipHook, pressed && styles.pressed]}
                onPress={() => haptics.trigger(type)}>
                <Text style={styles.chipText}>{type}</Text>
              </Pressable>
            ))}
          </View>
        </SectionCard>

        {/* Pattern presets */}
        <SectionCard title="Pattern Presets" cardBg={cardBg} titleColor={textSecondary}>
          <View style={styles.chipWrap}>
            {Object.keys(PRESET_NOTATIONS).map(name => (
              <Pressable
                key={name}
                style={({pressed}) => [styles.chip, styles.chipPreset, pressed && styles.pressed]}
                onPress={() => playPreset(name)}>
                <Text style={styles.chipText}>{name}</Text>
                <Text style={styles.chipSub}>{PRESET_NOTATIONS[name]}</Text>
              </Pressable>
            ))}
          </View>
        </SectionCard>

        {/* AHAP files */}
        <SectionCard title={`AHAP Files  ·  ${Platform.OS === 'ios' ? 'iOS' : 'Android fallback'}`} cardBg={cardBg} titleColor={textSecondary}>
          <Text style={[styles.hint, {color: textSecondary, marginBottom: 10}]}>
            {Platform.OS === 'ios'
              ? 'Plays .ahap files from ios/HapticFeedbackExample/haptics/.'
              : 'Android: pattern fallbacks used instead of .ahap files.'}
          </Text>
          <View style={styles.chipWrap}>
            {AHAP_FILES.map(({name, file, fallback, description}) => (
              <Pressable
                key={name}
                style={({pressed}) => [styles.chip, styles.chipAhap, pressed && styles.pressed]}
                onPress={() => playHaptic(file, fallback, DEFAULT_OPTIONS)}>
                <Text style={styles.chipText}>{name}</Text>
                <Text style={styles.chipSub}>{description}</Text>
              </Pressable>
            ))}
          </View>
        </SectionCard>

        {/* Pattern playground */}
        <SectionCard title="Pattern Playground" cardBg={cardBg} titleColor={textSecondary}>
          <View style={[styles.patternDisplay, {borderColor: canPlay ? '#3b82f6' : keyBorder}]}>
            {patternStr ? (
              <PatternPreview notation={patternStr} textColor={textPrimary} />
            ) : (
              <Text style={[styles.patternPlaceholder, {color: textSecondary}]}>
                tap keys below to build a pattern…
              </Text>
            )}
            {patternStr.length > 0 && (
              <Text style={[styles.eventCount, {color: textSecondary}]}>
                {patternEvents.length} event{patternEvents.length !== 1 ? 's' : ''}
              </Text>
            )}
          </View>

          <View style={[styles.legendRow, {borderColor: keyBorder}]}>
            {PATTERN_KEYS.map(k => (
              <View key={k.char} style={styles.legendCell}>
                <Text style={[styles.legendChar, {color: textPrimary}]}>{k.char}</Text>
                <Text style={[styles.legendHint, {color: textSecondary}]}>{k.hint}</Text>
              </View>
            ))}
          </View>

          <View style={styles.keyboard}>
            <View style={styles.keyRow}>
              {PATTERN_KEYS.map(k => (
                <Pressable
                  key={k.char}
                  style={({pressed}) => [styles.key, {backgroundColor: keyBg, borderColor: keyBorder}, pressed && styles.keyDown]}
                  onPress={() => appendKey(k.char)}>
                  <Text style={[styles.keyMain, {color: textPrimary}]}>{k.display}</Text>
                  <Text style={[styles.keySub, {color: textSecondary}]}>{k.hint}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.keyRow}>
              <Pressable
                style={({pressed}) => [styles.keyAction, {backgroundColor: keyBg, borderColor: keyBorder}, pressed && styles.keyDown]}
                onPress={backspace}>
                <Text style={[styles.keyMain, {color: textPrimary}]}>⌫</Text>
              </Pressable>
              <Pressable
                style={({pressed}) => [styles.keyAction, {borderColor: '#fca5a5', borderWidth: 1}, pressed && styles.keyDown]}
                onPress={clearPattern}>
                <Text style={[styles.keyMain, {color: '#ef4444'}]}>Clear</Text>
              </Pressable>
            </View>
          </View>

          <Pressable
            style={({pressed}) => [styles.playBtn, !canPlay && styles.playBtnDisabled, pressed && canPlay && styles.pressed]}
            onPress={playPattern}
            disabled={!canPlay}>
            <Text style={[styles.playBtnText, !canPlay && styles.playBtnTextDisabled]}>
              ▶  Play Pattern
            </Text>
          </Pressable>

          {lastPlayed ? (
            <Text style={[styles.lastPlayed, {color: textSecondary}]}>Last: {lastPlayed}</Text>
          ) : null}
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {flex: 1},
  scroll: {padding: 16, gap: 12},

  card: {borderRadius: 14, padding: 16, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2},
  heading: {fontSize: 26, fontWeight: '700', marginBottom: 4},
  subheading: {fontSize: 13, marginBottom: 12},
  cardTitle: {fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12},

  badgeRow: {flexDirection: 'row', gap: 8, flexWrap: 'wrap'},
  badge: {borderRadius: 20, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4},
  badgeText: {fontSize: 12, fontWeight: '600'},
  hint: {fontSize: 13},

  toggleBtn: {borderRadius: 10, paddingVertical: 12, alignItems: 'center'},
  toggleBtnText: {color: '#fff', fontWeight: '700', fontSize: 15},

  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  chip: {borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#3b82f6', alignItems: 'center'},
  chipHook: {backgroundColor: '#0ea5e9'},
  chipPreset: {backgroundColor: '#8b5cf6'},
  chipAhap: {backgroundColor: '#f97316'},
  pressed: {opacity: 0.65},
  chipText: {color: '#fff', fontSize: 13, fontWeight: '600'},
  chipSub: {color: 'rgba(255,255,255,0.75)', fontSize: 10, fontFamily: 'monospace', marginTop: 1},

  patternDisplay: {borderWidth: 1.5, borderRadius: 10, minHeight: 60, padding: 12, justifyContent: 'center', marginBottom: 12},
  patternLine: {flexDirection: 'row', flexWrap: 'wrap'},
  patternChar: {fontSize: 26, fontFamily: 'monospace', fontWeight: '700', letterSpacing: 3},
  patternPlaceholder: {fontSize: 14, fontStyle: 'italic'},
  eventCount: {fontSize: 11, marginTop: 6},

  legendRow: {flexDirection: 'row', justifyContent: 'space-around', borderWidth: 1, borderRadius: 8, paddingVertical: 8, marginBottom: 12},
  legendCell: {alignItems: 'center', gap: 3},
  legendChar: {fontSize: 16, fontWeight: '700', fontFamily: 'monospace'},
  legendHint: {fontSize: 10},

  keyboard: {gap: 8},
  keyRow: {flexDirection: 'row', gap: 8},
  key: {flex: 1, borderRadius: 10, borderWidth: 1, paddingVertical: 10, alignItems: 'center', justifyContent: 'center', gap: 3, minHeight: 58},
  keyAction: {flex: 1, borderRadius: 10, borderWidth: 1, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', minHeight: 52},
  keyDown: {opacity: 0.55, transform: [{scale: 0.97}]},
  keyMain: {fontSize: 20, fontWeight: '600'},
  keySub: {fontSize: 10},

  playBtn: {marginTop: 12, backgroundColor: '#22c55e', borderRadius: 12, paddingVertical: 14, alignItems: 'center'},
  playBtnDisabled: {backgroundColor: '#d1d5db'},
  playBtnText: {color: '#fff', fontWeight: '700', fontSize: 16},
  playBtnTextDisabled: {color: '#9ca3af'},
  lastPlayed: {marginTop: 10, fontSize: 12, textAlign: 'center', fontStyle: 'italic'},
});
