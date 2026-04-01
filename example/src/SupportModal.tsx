import React, { useEffect, useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIAP, ErrorCode } from 'react-native-iap';
import type { Purchase, PurchaseError } from 'react-native-iap';

// ─── Types & constants ─────────────────────────────────────────────────────────

export type SupportTier = 'support_0' | 'support_1' | 'support_2' | null;
export const SUPPORT_STORAGE_KEY = '@haptic_supporter_tier';

const TIER_RANK: Record<string, number> = {
  support_0: 1,
  support_1: 2,
  support_2: 3,
};

export function higherTier(a: SupportTier, b: SupportTier): SupportTier {
  const ra = a ? TIER_RANK[a] : 0;
  const rb = b ? TIER_RANK[b] : 0;
  return ra >= rb ? a : b;
}

const TIERS = [
  {
    productId: 'support_0',
    tier: 'support_0' as const,
    fallbackPrice: '$0.99',
    label: 'Supporter',
    emoji: '☕',
    description: 'Buy me a coffee',
    color: '#b87333',
  },
  {
    productId: 'support_1',
    tier: 'support_1' as const,
    fallbackPrice: '$2.99',
    label: 'Super Supporter',
    emoji: '🍕',
    description: 'Buy me lunch',
    color: '#9ca3af',
  },
  {
    productId: 'support_2',
    tier: 'support_2' as const,
    fallbackPrice: '$4.99',
    label: 'Best Supporter',
    emoji: '🏆',
    description: "You're the best!",
    color: '#f59e0b',
  },
] as const;

const PRODUCT_IDS = TIERS.map(t => t.productId);

function tierForProduct(productId: string): SupportTier {
  return TIERS.find(t => t.productId === productId)?.tier ?? null;
}

// ─── Component ─────────────────────────────────────────────────────────────────

interface Props {
  visible: boolean;
  onClose: () => void;
  isDark: boolean;
  currentTier: SupportTier;
  onTierChange: (tier: SupportTier) => void;
}

export default function SupportModal({
  visible,
  onClose,
  isDark,
  currentTier,
  onTierChange,
}: Props) {
  // ── Purchase in-progress state ───────────────────────────────────────────────

  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  // ── useIAP hook ──────────────────────────────────────────────────────────────
  // The hook manages initConnection on mount and listener cleanup on unmount.
  // onPurchaseSuccess / onPurchaseError fire for every purchase event while
  // this component is mounted.

  const onPurchaseSuccess = useCallback(
    async (purchase: Purchase) => {
      setPurchasingId(null);
      const newTier = tierForProduct(purchase.productId);
      const best = higherTier(newTier, currentTier);
      await AsyncStorage.setItem(SUPPORT_STORAGE_KEY, best ?? '');
      onTierChange(best);
      const cfg = TIERS.find(t => t.tier === best);
      Alert.alert(
        'Thank you! 🙏',
        `You are now a ${cfg?.label ?? 'Supporter'}! ${cfg?.emoji ?? ''}`,
      );
      onClose();
    },
    [currentTier, onTierChange, onClose, setPurchasingId],
  );

  const onPurchaseError = useCallback(
    (error: PurchaseError) => {
      setPurchasingId(null);
      if (error.code !== ErrorCode.UserCancelled) {
        Alert.alert('Purchase failed', error.message);
      }
    },
    [setPurchasingId],
  );

  const {
    connected,
    products,
    availablePurchases,
    fetchProducts,
    requestPurchase,
    finishTransaction,
    getAvailablePurchases,
  } = useIAP({ onPurchaseSuccess, onPurchaseError });

  // ── Fetch products & restore purchases when connected ────────────────────────

  useEffect(() => {
    if (!connected) return;

    fetchProducts({ skus: PRODUCT_IDS, type: 'in-app' });
    getAvailablePurchases();
  }, [connected, fetchProducts, getAvailablePurchases]);

  // ── Restore owned tier from availablePurchases state ────────────────────────

  useEffect(() => {
    if (availablePurchases.length === 0) return;

    let best = currentTier;
    for (const p of availablePurchases) {
      best = higherTier(best, tierForProduct(p.productId));
    }

    if (best !== currentTier) {
      AsyncStorage.setItem(SUPPORT_STORAGE_KEY, best ?? '').catch(() => {});
      onTierChange(best);
    }
  }, [availablePurchases]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Purchase handler ─────────────────────────────────────────────────────────

  const purchase = useCallback(
    async (productId: string) => {
      setPurchasingId(productId);
      try {
        await requestPurchase({
          type: 'in-app',
          request: {
            apple: { sku: productId },
            google: { skus: [productId] },
          },
        });
      } catch (e: any) {
        // Non-cancellation errors surface via the onPurchaseError callback
        setPurchasingId(null);
      }
    },
    [requestPurchase, finishTransaction], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ── Derived state ────────────────────────────────────────────────────────────

  const tierRank = currentTier ? TIER_RANK[currentTier] : 0;
  const isLoading = !connected;

  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textSecondary = isDark ? '#94a3b8' : '#64748b';
  const overlayBg = isDark ? 'rgba(0,0,0,0.72)' : 'rgba(0,0,0,0.48)';

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Backdrop — tap to close */}
      <Pressable
        style={[styles.overlay, { backgroundColor: overlayBg }]}
        onPress={onClose}
      >
        {/* Sheet — absorbs taps so backdrop doesn't fire */}
        <Pressable
          style={[styles.sheet, { backgroundColor: cardBg }]}
          onPress={() => {}}
        >
          <View style={styles.handle} />

          <Text style={[styles.title, { color: textPrimary }]}>
            Support the Developer
          </Text>
          <Text style={[styles.subtitle, { color: textSecondary }]}>
            react-native-haptic-feedback is free & open-source.{'\n'}
            Your support keeps it maintained and growing.
          </Text>

          {isLoading ? (
            <View style={styles.loaderBox}>
              <ActivityIndicator size="large" color="#f59e0b" />
              <Text style={[styles.loaderText, { color: textSecondary }]}>
                Connecting to store…
              </Text>
            </View>
          ) : (
            <View style={styles.tiersBox}>
              {TIERS.map(cfg => {
                const product = products.find(p => p.id === cfg.productId);
                const owned = tierRank >= TIER_RANK[cfg.tier];
                const isGold = cfg.tier === 'support_2';
                const isPurchasing = purchasingId === cfg.productId;
                const isDisabled = owned || purchasingId !== null;

                return (
                  <Pressable
                    key={cfg.productId}
                    style={({ pressed }) => [
                      styles.tierRow,
                      { borderColor: cfg.color },
                      isGold && styles.tierRowGold,
                      owned && {
                        backgroundColor: cfg.color + '1a',
                        borderColor: cfg.color,
                      },
                      purchasingId !== null &&
                        !isPurchasing && { opacity: 0.45 },
                      pressed &&
                        !isDisabled && {
                          opacity: 0.72,
                          transform: [{ scale: 0.99 }],
                        },
                    ]}
                    onPress={() => !isDisabled && purchase(cfg.productId)}
                    disabled={isDisabled}
                  >
                    <Text style={styles.tierEmoji}>{cfg.emoji}</Text>
                    <View style={styles.tierInfo}>
                      <Text
                        style={[
                          styles.tierLabel,
                          { color: cfg.color },
                          isGold && styles.tierLabelGold,
                        ]}
                      >
                        {cfg.label}
                      </Text>
                      <Text style={[styles.tierDesc, { color: textSecondary }]}>
                        {cfg.description}
                      </Text>
                    </View>
                    <View style={styles.tierAction}>
                      {owned ? (
                        <Text style={[styles.ownedLabel, { color: cfg.color }]}>
                          ✓ Owned
                        </Text>
                      ) : (
                        <View
                          style={[
                            styles.priceBtn,
                            { backgroundColor: cfg.color },
                          ]}
                        >
                          {isPurchasing ? (
                            <ActivityIndicator
                              size="small"
                              color="#fff"
                              style={styles.priceBtnSpinner}
                            />
                          ) : (
                            <Text style={styles.priceBtnText}>
                              {product?.displayPrice ?? cfg.fallbackPrice}
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}

          <Text style={[styles.legal, { color: textSecondary }]}>
            One-time non-consumable purchases. Previously purchased tiers are
            restored automatically.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.closeBtn,
              pressed && { opacity: 0.65 },
            ]}
            onPress={onClose}
          >
            <Text style={[styles.closeBtnText, { color: textSecondary }]}>
              Close
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 44,
    gap: 14,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#94a3b8',
    alignSelf: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  loaderBox: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  loaderText: { fontSize: 13 },
  tiersBox: { gap: 10 },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  tierRowGold: {
    borderWidth: 2,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  tierEmoji: { fontSize: 30 },
  tierInfo: { flex: 1, gap: 3 },
  tierLabel: { fontSize: 15, fontWeight: '700' },
  tierLabelGold: { fontSize: 17 },
  tierDesc: { fontSize: 12 },
  tierAction: { alignItems: 'center', justifyContent: 'center', minWidth: 76 },
  priceBtn: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  priceBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  priceBtnSpinner: { width: 20, height: 20 },
  ownedLabel: { fontWeight: '700', fontSize: 13 },
  legal: { fontSize: 11, textAlign: 'center', lineHeight: 16 },
  closeBtn: { alignItems: 'center', paddingVertical: 10 },
  closeBtnText: { fontSize: 15, fontWeight: '600' },
});
