import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  endConnection,
  finishTransaction,
  getAvailablePurchases,
  getProducts,
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
} from 'react-native-iap';

// ─── Types & constants ─────────────────────────────────────────────────────────

export type SupportTier = 'bronze' | 'silver' | 'gold' | null;
export const SUPPORT_STORAGE_KEY = '@haptic_supporter_tier';

const TIER_RANK: Record<string, number> = { bronze: 1, silver: 2, gold: 3 };

export function higherTier(a: SupportTier, b: SupportTier): SupportTier {
  const ra = a ? TIER_RANK[a] : 0;
  const rb = b ? TIER_RANK[b] : 0;
  return ra >= rb ? a : b;
}

const TIERS = [
  {
    productId: 'haptic_support_bronze',
    tier: 'bronze' as const,
    fallbackPrice: '$0.99',
    label: 'Supporter',
    emoji: '☕',
    description: 'Buy me a coffee',
    color: '#b87333',
  },
  {
    productId: 'haptic_support_silver',
    tier: 'silver' as const,
    fallbackPrice: '$2.99',
    label: 'Super Supporter',
    emoji: '🍕',
    description: 'Buy me lunch',
    color: '#9ca3af',
  },
  {
    productId: 'haptic_support_gold',
    tier: 'gold' as const,
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
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [storeError, setStoreError] = useState<string | null>(null);

  // Keep a ref so purchase listener closure always sees latest tier
  const tierRef = useRef(currentTier);
  useEffect(() => {
    tierRef.current = currentTier;
  }, [currentTier]);

  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textSecondary = isDark ? '#94a3b8' : '#64748b';
  const overlayBg = isDark ? 'rgba(0,0,0,0.72)' : 'rgba(0,0,0,0.48)';

  // ── IAP lifecycle ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!visible) return;

    setLoading(true);
    setStoreError(null);

    const updateSub = purchaseUpdatedListener(async (purchase: any) => {
      try {
        await finishTransaction({ purchase, isConsumable: false });
        const newTier = tierForProduct(purchase.productId);
        const best = higherTier(newTier, tierRef.current);
        await AsyncStorage.setItem(SUPPORT_STORAGE_KEY, best ?? '');
        onTierChange(best);
        const cfg = TIERS.find(t => t.tier === best);
        Alert.alert(
          'Thank you! 🙏',
          `You are now a ${cfg?.label ?? 'Supporter'}! ${cfg?.emoji ?? ''}`,
        );
      } catch (e) {
        console.warn('[IAP] finishTransaction error', e);
      } finally {
        setPurchasing(null);
      }
    });

    const errorSub = purchaseErrorListener((err: any) => {
      setPurchasing(null);
      if (err?.code !== 'E_USER_CANCELLED') {
        setStoreError(err?.message ?? 'Purchase failed. Please try again.');
      }
    });

    (async () => {
      try {
        await initConnection();

        // Restore owned purchases silently
        try {
          const owned = await getAvailablePurchases();
          let best = tierRef.current;
          for (const p of owned) {
            best = higherTier(best, tierForProduct(p.productId));
          }
          if (best !== tierRef.current) {
            await AsyncStorage.setItem(SUPPORT_STORAGE_KEY, best ?? '');
            onTierChange(best);
          }
        } catch (_) {
          // purchase history is best-effort
        }

        const fetched = await getProducts({ skus: PRODUCT_IDS });
        // Sort ascending so order matches TIERS definition
        (fetched as any[]).sort(
          (a: any, b: any) => parseFloat(a.price) - parseFloat(b.price),
        );
        setProducts(fetched as any[]);
      } catch (e: any) {
        setStoreError(e?.message ?? 'Could not connect to the store.');
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      updateSub.remove();
      errorSub.remove();
      endConnection().catch(() => {});
    };
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Purchase handler ─────────────────────────────────────────────────────────

  const purchase = useCallback(async (productId: string) => {
    try {
      setStoreError(null);
      setPurchasing(productId);
      const req =
        Platform.OS === 'android' ? { skus: [productId] } : { sku: productId };
      await requestPurchase(req as any);
    } catch (e: any) {
      setPurchasing(null);
      if (e?.code !== 'E_USER_CANCELLED') {
        setStoreError(e?.message ?? 'Purchase failed. Please try again.');
      }
    }
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────────

  const tierRank = currentTier ? TIER_RANK[currentTier] : 0;

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

          {loading ? (
            <View style={styles.loaderBox}>
              <ActivityIndicator size="large" color="#f59e0b" />
              <Text style={[styles.loaderText, { color: textSecondary }]}>
                Connecting to store…
              </Text>
            </View>
          ) : (
            <View style={styles.tiersBox}>
              {TIERS.map(cfg => {
                const product = products.find(
                  (p: any) => p.productId === cfg.productId,
                );
                const owned = tierRank >= TIER_RANK[cfg.tier];
                const isProcessing = purchasing === cfg.productId;
                const isGold = cfg.tier === 'gold';

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
                      pressed &&
                        !owned &&
                        !purchasing && {
                          opacity: 0.72,
                          transform: [{ scale: 0.99 }],
                        },
                    ]}
                    onPress={() =>
                      !owned && !purchasing && purchase(cfg.productId)
                    }
                    disabled={owned || !!purchasing}
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
                      {isProcessing ? (
                        <ActivityIndicator size="small" color={cfg.color} />
                      ) : owned ? (
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
                          <Text style={styles.priceBtnText}>
                            {product?.localizedPrice ?? cfg.fallbackPrice}
                          </Text>
                        </View>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}

          {storeError ? (
            <Text style={styles.errorText}>{storeError}</Text>
          ) : null}

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
  ownedLabel: { fontWeight: '700', fontSize: 13 },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  legal: { fontSize: 11, textAlign: 'center', lineHeight: 16 },
  closeBtn: { alignItems: 'center', paddingVertical: 10 },
  closeBtnText: { fontSize: 15, fontWeight: '600' },
});
