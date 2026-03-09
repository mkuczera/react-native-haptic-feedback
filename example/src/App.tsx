import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  useColorScheme,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import HapticFeedback, {
  HapticFeedbackTypes,
  TouchableHaptic,
  pattern,
  Patterns,
} from 'react-native-haptic-feedback';
import type { HapticOptions, SystemHapticStatus } from 'react-native-haptic-feedback';

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_OPTIONS: HapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

type HapticEntry = { label: string; type: HapticFeedbackTypes };
type HapticGroup = { title: string; entries: HapticEntry[] };

const HAPTIC_GROUPS: HapticGroup[] = [
  {
    title: 'Impact',
    entries: [
      { label: 'Light',  type: HapticFeedbackTypes.impactLight },
      { label: 'Medium', type: HapticFeedbackTypes.impactMedium },
      { label: 'Heavy',  type: HapticFeedbackTypes.impactHeavy },
      { label: 'Rigid',  type: HapticFeedbackTypes.rigid },
      { label: 'Soft',   type: HapticFeedbackTypes.soft },
    ],
  },
  {
    title: 'Notification',
    entries: [
      { label: 'Success', type: HapticFeedbackTypes.notificationSuccess },
      { label: 'Warning', type: HapticFeedbackTypes.notificationWarning },
      { label: 'Error',   type: HapticFeedbackTypes.notificationError },
    ],
  },
  {
    title: 'Selection',
    entries: [
      { label: 'Selection', type: HapticFeedbackTypes.selection },
    ],
  },
  {
    title: 'Device Feedback',
    entries: [
      { label: 'Clock Tick',        type: HapticFeedbackTypes.clockTick },
      { label: 'Context Click',     type: HapticFeedbackTypes.contextClick },
      { label: 'Keyboard Press',    type: HapticFeedbackTypes.keyboardPress },
      { label: 'Keyboard Release',  type: HapticFeedbackTypes.keyboardRelease },
      { label: 'Keyboard Tap',      type: HapticFeedbackTypes.keyboardTap },
      { label: 'Long Press',        type: HapticFeedbackTypes.longPress },
      { label: 'Text Handle',       type: HapticFeedbackTypes.textHandleMove },
      { label: 'Virtual Key',       type: HapticFeedbackTypes.virtualKey },
      { label: 'Virtual Key ↑',     type: HapticFeedbackTypes.virtualKeyRelease },
    ],
  },
  {
    title: 'Android Effects',
    entries: [
      { label: 'Click',       type: HapticFeedbackTypes.effectClick },
      { label: 'Double',      type: HapticFeedbackTypes.effectDoubleClick },
      { label: 'Heavy Click', type: HapticFeedbackTypes.effectHeavyClick },
      { label: 'Tick',        type: HapticFeedbackTypes.effectTick },
    ],
  },
  {
    title: 'New  (Android API 30+)',
    entries: [
      { label: 'Confirm',          type: HapticFeedbackTypes.confirm },
      { label: 'Reject',           type: HapticFeedbackTypes.reject },
      { label: 'Gesture Start',    type: HapticFeedbackTypes.gestureStart },
      { label: 'Gesture End',      type: HapticFeedbackTypes.gestureEnd },
      { label: 'Segment Tick',     type: HapticFeedbackTypes.segmentTick },
      { label: 'Seg. Freq. Tick',  type: HapticFeedbackTypes.segmentFrequentTick },
      { label: 'Toggle On',        type: HapticFeedbackTypes.toggleOn },
      { label: 'Toggle Off',       type: HapticFeedbackTypes.toggleOff },
    ],
  },
];

// Preset name → original notation string (for display)
const PRESET_NOTATIONS: Record<string, string> = {
  success:     'oO.O',
  error:       'OO.OO',
  warning:     'O.O',
  heartbeat:   'oO--oO',
  tripleClick: 'o.o.o',
  notification: 'o-O=o',
};

// Pattern keyboard key definitions
const PATTERN_KEYS = [
  { char: 'o', display: 'o', hint: 'soft' },
  { char: 'O', display: 'O', hint: 'strong' },
  { char: '.', display: '·', hint: '100 ms' },
  { char: '-', display: '—', hint: '300 ms' },
  { char: '=', display: '≡', hint: '1 s' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

function SectionCard({
  title,
  children,
  bg,
  titleColor,
}: {
  title: string;
  children: React.ReactNode;
  bg: string;
  titleColor: string;
}) {
  return (
    <View style={[styles.card, { backgroundColor: bg }]}>
      <Text style={[styles.cardTitle, { color: titleColor }]}>{title}</Text>
      {children}
    </View>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App(): React.JSX.Element {
  const isDark = useColorScheme() === 'dark';

  const bg       = isDark ? Colors.darker  : Colors.lighter;
  const cardBg   = isDark ? Colors.black   : Colors.white;
  const textPrimary   = isDark ? Colors.white  : Colors.black;
  const textSecondary = isDark ? Colors.light  : Colors.dark;
  const keyBg    = isDark ? '#1f2937' : '#f9fafb';
  const keyBorder = isDark ? '#374151' : '#d1d5db';

  const [status, setStatus]       = useState<SystemHapticStatus | null>(null);
  const [patternStr, setPatternStr] = useState('');
  const [lastPlayed, setLastPlayed] = useState('');

  useEffect(() => {
    HapticFeedback.getSystemHapticStatus().then(setStatus).catch(() => {});
  }, []);

  // Pattern playground handlers
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
    const events = Patterns[name];
    if (!events) return;
    setLastPlayed(`${name}  "${PRESET_NOTATIONS[name]}"`);
    HapticFeedback.triggerPattern(events, DEFAULT_OPTIONS);
  }, []);

  const patternEvents = pattern(patternStr);
  const canPlay = patternStr.length > 0 && patternEvents.length > 0;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={bg}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ backgroundColor: bg }}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Header ── */}
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <Text style={[styles.heading, { color: textPrimary }]}>
            Haptic Feedback
          </Text>
          {status ? (
            <View style={styles.badgeRow}>
              <Badge
                label={status.vibrationEnabled ? '✓ Vibration on' : '✗ Vibration off'}
                color={status.vibrationEnabled ? '#22c55e' : '#ef4444'}
              />
              <Badge label={`Ringer: ${status.ringerMode}`} color="#6366f1" />
            </View>
          ) : (
            <Text style={[styles.hint, { color: textSecondary }]}>
              Checking system status…
            </Text>
          )}
        </View>

        {/* ── Haptic type groups ── */}
        {HAPTIC_GROUPS.map(group => (
          <SectionCard
            key={group.title}
            title={group.title}
            bg={cardBg}
            titleColor={textSecondary}
          >
            <View style={styles.chipWrap}>
              {group.entries.map(({ label, type }) => (
                <TouchableHaptic
                  key={type}
                  hapticType={type}
                  hapticTrigger="onPress"
                  hapticOptions={DEFAULT_OPTIONS}
                  style={({ pressed }) => [
                    styles.chip,
                    pressed && styles.chipPressed,
                  ]}
                >
                  <Text style={styles.chipText}>{label}</Text>
                </TouchableHaptic>
              ))}
            </View>
          </SectionCard>
        ))}

        {/* ── Presets ── */}
        <SectionCard title="Pattern Presets" bg={cardBg} titleColor={textSecondary}>
          <View style={styles.chipWrap}>
            {Object.keys(PRESET_NOTATIONS).map(name => (
              <Pressable
                key={name}
                style={({ pressed }) => [
                  styles.chip,
                  styles.chipPreset,
                  pressed && styles.chipPressed,
                ]}
                onPress={() => playPreset(name)}
              >
                <Text style={styles.chipText}>{name}</Text>
                <Text style={styles.chipSub}>{PRESET_NOTATIONS[name]}</Text>
              </Pressable>
            ))}
          </View>
        </SectionCard>

        {/* ── Pattern Playground ── */}
        <SectionCard
          title="Pattern Playground"
          bg={cardBg}
          titleColor={textSecondary}
        >
          {/* Display */}
          <View
            style={[
              styles.patternDisplay,
              { borderColor: canPlay ? '#3b82f6' : keyBorder },
            ]}
          >
            {patternStr ? (
              <PatternPreview notation={patternStr} textColor={textPrimary} />
            ) : (
              <Text style={[styles.patternPlaceholder, { color: textSecondary }]}>
                tap the keys below to build a pattern…
              </Text>
            )}
            {patternStr.length > 0 && (
              <Text style={[styles.eventCount, { color: textSecondary }]}>
                {patternEvents.length} event{patternEvents.length !== 1 ? 's' : ''}
              </Text>
            )}
          </View>

          {/* Legend */}
          <View style={[styles.legendRow, { borderColor: keyBorder }]}>
            {PATTERN_KEYS.map(k => (
              <View key={k.char} style={styles.legendCell}>
                <Text style={[styles.legendChar, { color: textPrimary }]}>
                  {k.char}
                </Text>
                <Text style={[styles.legendHint, { color: textSecondary }]}>
                  {k.hint}
                </Text>
              </View>
            ))}
          </View>

          {/* Key rows */}
          <View style={styles.keyboard}>
            {/* Main keys */}
            <View style={styles.keyRow}>
              {PATTERN_KEYS.map(k => (
                <Pressable
                  key={k.char}
                  style={({ pressed }) => [
                    styles.key,
                    { backgroundColor: keyBg, borderColor: keyBorder },
                    pressed && styles.keyDown,
                  ]}
                  onPress={() => appendKey(k.char)}
                  accessibilityLabel={`${k.char} — ${k.hint}`}
                >
                  <Text style={[styles.keyMain, { color: textPrimary }]}>
                    {k.display}
                  </Text>
                  <Text style={[styles.keySub, { color: textSecondary }]}>
                    {k.hint}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Action keys */}
            <View style={styles.keyRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.keyAction,
                  { backgroundColor: keyBg, borderColor: keyBorder },
                  pressed && styles.keyDown,
                ]}
                onPress={backspace}
                accessibilityLabel="Backspace"
              >
                <Text style={[styles.keyMain, { color: textPrimary }]}>⌫</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.keyAction,
                  styles.keyDanger,
                  { borderColor: isDark ? '#7f1d1d' : '#fca5a5' },
                  pressed && styles.keyDown,
                ]}
                onPress={clearPattern}
                accessibilityLabel="Clear pattern"
              >
                <Text style={[styles.keyMain, { color: '#ef4444' }]}>Clear</Text>
              </Pressable>
            </View>
          </View>

          {/* Play button */}
          <Pressable
            style={({ pressed }) => [
              styles.playBtn,
              !canPlay && styles.playBtnDisabled,
              pressed && canPlay && styles.playBtnPressed,
            ]}
            onPress={playPattern}
            disabled={!canPlay}
            accessibilityLabel="Play pattern"
          >
            <Text style={[styles.playBtnText, !canPlay && styles.playBtnTextDisabled]}>
              ▶  Play Pattern
            </Text>
          </Pressable>

          {lastPlayed ? (
            <Text style={[styles.lastPlayed, { color: textSecondary }]}>
              Last played: {lastPlayed}
            </Text>
          ) : null}
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── PatternPreview ───────────────────────────────────────────────────────────
// Renders each character of the notation string with colour coding:
//  o  → blue      O  → indigo      gap chars → amber

function PatternPreview({
  notation,
  textColor,
}: {
  notation: string;
  textColor: string;
}) {
  return (
    <Text style={styles.patternLine}>
      {notation.split('').map((ch, i) => {
        let color = textColor;
        if (ch === 'o') color = '#60a5fa';
        else if (ch === 'O') color = '#818cf8';
        else if (ch === '.' || ch === '-' || ch === '=') color = '#f59e0b';
        return (
          <Text key={i} style={[styles.patternChar, { color }]}>
            {ch}
          </Text>
        );
      })}
    </Text>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { padding: 16, gap: 12 },

  // Cards
  card: {
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },

  // Status
  badgeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  badge: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 12, fontWeight: '600' },
  hint: { fontSize: 13 },

  // Chips
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
  },
  chipPreset: { backgroundColor: '#8b5cf6' },
  chipPressed: { opacity: 0.65 },
  chipText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  chipSub: { color: 'rgba(255,255,255,0.75)', fontSize: 10, fontFamily: 'monospace', marginTop: 1 },

  // Pattern display
  patternDisplay: {
    borderWidth: 1.5,
    borderRadius: 10,
    minHeight: 60,
    padding: 12,
    justifyContent: 'center',
    marginBottom: 12,
  },
  patternLine: { flexDirection: 'row', flexWrap: 'wrap' },
  patternChar: {
    fontSize: 26,
    fontFamily: 'monospace',
    fontWeight: '700',
    letterSpacing: 3,
  },
  patternPlaceholder: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  eventCount: {
    fontSize: 11,
    marginTop: 6,
  },

  // Legend
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    marginBottom: 12,
  },
  legendCell: { alignItems: 'center', gap: 3 },
  legendChar: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  legendHint: { fontSize: 10 },

  // Keyboard
  keyboard: { gap: 8 },
  keyRow: { flexDirection: 'row', gap: 8 },
  key: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    minHeight: 58,
  },
  keyAction: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  keyDanger: {
    backgroundColor: 'transparent',
  },
  keyDown: { opacity: 0.55, transform: [{ scale: 0.97 }] },
  keyMain: { fontSize: 20, fontWeight: '600' },
  keySub: { fontSize: 10 },

  // Play
  playBtn: {
    marginTop: 12,
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  playBtnDisabled: { backgroundColor: '#d1d5db' },
  playBtnPressed: { opacity: 0.8 },
  playBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  playBtnTextDisabled: { color: '#9ca3af' },
  lastPlayed: {
    marginTop: 10,
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
