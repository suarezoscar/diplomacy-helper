<script setup>
import { ref, computed } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useGameStore } from '@/stores/game'
import { useOrders } from '@/composables/useOrders'
import { ORDER_TYPES, UNIT_TYPES, formatOrder } from '@/constants/diplomacy'
import { useI18n } from '@/i18n'
import { orderIcon, unitIcon } from '@/constants/icons'
import ProvinceSelect from '@/components/ProvinceSelect.vue'

const { t, tOrderType, tUnitType, tProvince } = useI18n()
const playerStore = usePlayerStore()
const gameStore = useGameStore()
const { saveOrder, deleteOrder, getMyOrders } = useOrders()

const mode = ref('text')
const orders = ref([])
const error = ref('')
const saving = ref(false)

const rawText = ref('')

const showTarget = computed(() => ['move', 'support', 'convoy'].includes(currentOrder.value.order_type))
const showSupportedUnit = computed(() => ['support', 'convoy'].includes(currentOrder.value.order_type))
const showSupportedAction = computed(() => currentOrder.value.order_type === 'support')

const currentOrder = ref({
  order_type: 'move',
  unit_type: 'army',
  origin: '',
  target: '',
  supported_unit: '',
  supported_action: 'move',
})

function addOrder() {
  if (!currentOrder.value.origin.trim()) { error.value = t('game.selectOrigin'); return }
  if (showTarget.value && !currentOrder.value.target.trim()) { error.value = t('game.selectTarget'); return }
  error.value = ''
  orders.value.push({
    key: Date.now(),
    ...currentOrder.value,
    origin: currentOrder.value.origin.toUpperCase(),
    target: currentOrder.value.target.toUpperCase(),
    supported_unit: currentOrder.value.supported_unit.toUpperCase(),
  })
  currentOrder.value = { order_type: 'move', unit_type: 'army', origin: '', target: '', supported_unit: '', supported_action: 'move' }
}

function removeOrder(index) { orders.value.splice(index, 1) }

async function handleConfirmGuided() {
  if (orders.value.length === 0) { error.value = t('game.addAtLeastOne'); return }
  if (!gameStore.currentRound) { error.value = 'No active round'; return }
  saving.value = true; error.value = ''
  try {
    for (const order of orders.value) {
      await saveOrder({
        round_id: gameStore.currentRound.$id,
        player_id: playerStore.playerId,
        player_name: playerStore.playerName,
        power: gameStore.myPower || '',
        order_type: order.order_type,
        unit_type: order.unit_type,
        origin: order.origin,
        target: order.target || null,
        supported_unit: order.supported_unit || null,
        supported_action: order.supported_action || null,
        status: 'confirmed',
      })
    }
    orders.value = []
    await getMyOrders(gameStore.currentRound.$id, playerStore.playerId)
  } catch (e) { error.value = e.message } finally { saving.value = false }
}

async function handleConfirmText() {
  const lines = rawText.value.split('\n').map(l => l.trim()).filter(l => l.length > 0)
  if (lines.length === 0) { error.value = t('game.writeAtLeastOne'); return }
  if (!gameStore.currentRound) { error.value = 'No active round'; return }
  saving.value = true; error.value = ''
  try {
    for (const line of lines) {
      await saveOrder({
        round_id: gameStore.currentRound.$id,
        player_id: playerStore.playerId,
        player_name: playerStore.playerName,
        power: gameStore.myPower || '',
        order_type: 'raw',
        unit_type: 'raw',
        origin: 'RAW',
        target: null,
        supported_unit: null,
        supported_action: null,
        raw_text: line,
        status: 'confirmed',
      })
    }
    rawText.value = ''
    await getMyOrders(gameStore.currentRound.$id, playerStore.playerId)
  } catch (e) { error.value = e.message } finally { saving.value = false }
}

async function handleDeleteOrder(orderDoc) {
  try { await deleteOrder(orderDoc.$id); await getMyOrders(gameStore.currentRound.$id, playerStore.playerId) } catch (e) { error.value = e.message }
}

function orderNotation(order) {
  return formatOrder(order)
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm text-text-secondary flex items-center gap-2">
        <span>📜</span> {{ t('game.yourOrders') }}
      </h3>
      <div class="flex rounded-lg border border-border overflow-hidden">
        <button
          @click="mode = 'text'"
          class="text-xs px-3 py-1.5 transition-colors"
          :class="mode === 'text' ? 'bg-accent text-white' : 'text-text-muted hover:text-text'"
        >📝 {{ t('game.rawTextMode') }}</button>
        <button
          @click="mode = 'guided'"
          class="text-xs px-3 py-1.5 transition-colors flex items-center gap-1"
          :class="mode === 'guided' ? 'bg-accent text-white' : 'text-text-muted hover:text-text'"
        >
          🧩 {{ t('game.guided') }}
          <span class="tag ml-1 text-[10px] px-1 py-0 leading-tight" :class="mode === 'guided' ? 'bg-white/20 text-white' : 'bg-warning/20 text-warning'">α</span>
        </button>
      </div>
    </div>

    <div v-if="gameStore.myOrders.length > 0" class="space-y-2 mb-4">
      <div
        v-for="order in gameStore.myOrders"
        :key="order.$id"
        class="card px-4 py-3 flex items-center justify-between"
        style="border-color: var(--color-success)"
      >
        <div class="min-w-0 flex-1">
          <p class="font-mono text-sm text-text">{{ orderNotation(order) }}</p>
           <p v-if="!order.raw_text" class="text-xs text-text-muted mt-0.5 flex items-center gap-1.5 flex-wrap">
            <span>{{ orderIcon(order.order_type) }} {{ tOrderType(order.order_type) }}</span>
            <span>&middot;</span>
            <span>{{ unitIcon(order.unit_type) }} {{ tUnitType(order.unit_type) }}</span>
            <span>&middot;</span>
            <span>{{ tProvince(order.origin) }} ({{ order.origin }})</span>
            <template v-if="order.target"><span>&rarr; {{ tProvince(order.target) }} ({{ order.target }})</span></template>
          </p>
        </div>
        <div class="flex items-center gap-2 shrink-0 ml-3">
          <span class="tag tag-success">✅ {{ t('game.confirmed') }}</span>
          <button @click="handleDeleteOrder(order)" class="btn-ghost !text-error">{{ t('game.delete') }}</button>
        </div>
      </div>
    </div>

    <div v-if="mode === 'text'" class="card-elevated p-4 space-y-3">
      <textarea
        v-model="rawText"
        :placeholder="t('game.writeOrdersHint')"
        rows="8"
        class="w-full font-mono text-sm resize-y"
      ></textarea>
      <p v-if="error" class="text-xs text-error">{{ error }}</p>
      <button @click="handleConfirmText" :disabled="saving" class="btn-primary w-full py-3.5 text-base">
        {{ saving ? t('game.saving') : t('game.confirmAllOrders') }}
      </button>
    </div>

    <div v-if="mode === 'guided'" class="card-elevated p-4 space-y-4">
      <div class="flex items-center gap-2 mb-1">
        <span class="tag tag-warning text-[10px] px-1.5 py-0.5">α ALPHA</span>
        <span class="text-[10px] text-text-muted">{{ t('game.alphaWarning') }}</span>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-text-muted mb-1 ml-1">{{ t('game.orderType') }}</label>
          <div class="grid grid-cols-2 gap-1.5">
            <button
              v-for="type in ORDER_TYPES"
              :key="type.id"
              @click="currentOrder.order_type = type.id"
              class="text-xs py-2 px-2 rounded-lg border transition-all flex flex-col items-center gap-0.5"
              :class="currentOrder.order_type === type.id
                ? 'border-accent bg-accent/10 text-text'
                : 'border-border text-text-muted hover:border-border-light'"
            >
              <span class="text-sm">{{ orderIcon(type.id) }}</span>
              {{ tOrderType(type.id) }}
            </button>
          </div>
        </div>
        <div>
          <label class="block text-xs text-text-muted mb-1 ml-1">{{ t('game.unit') }}</label>
          <div class="grid grid-cols-2 gap-1.5">
            <button
              v-for="u in UNIT_TYPES"
              :key="u.id"
              @click="currentOrder.unit_type = u.id"
              class="text-xs py-2 px-2 rounded-lg border transition-all flex flex-col items-center gap-0.5"
              :class="currentOrder.unit_type === u.id
                ? 'border-accent bg-accent/10 text-text'
                : 'border-border text-text-muted hover:border-border-light'"
            >
              <span class="text-sm">{{ unitIcon(u.id) }}</span>
              {{ tUnitType(u.id) }}
            </button>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-xs text-text-muted mb-1 ml-1">{{ t('game.origin') }}</label>
        <ProvinceSelect v-model="currentOrder.origin" placeholder="e.g. VIE" />
      </div>

      <div v-if="showTarget">
        <label class="block text-xs text-text-muted mb-1 ml-1">{{ t('game.target') }}</label>
        <ProvinceSelect v-model="currentOrder.target" placeholder="e.g. BUD" />
      </div>

      <div v-if="showSupportedUnit">
        <label class="block text-xs text-text-muted mb-1 ml-1">
          {{ currentOrder.order_type === 'convoy' ? t('game.armyConvoyed') : t('game.supportedUnit') }}
        </label>
        <input v-model="currentOrder.supported_unit" type="text" placeholder="e.g. A VIE" class="!font-mono" />
      </div>

      <div v-if="showSupportedAction">
        <label class="block text-xs text-text-muted mb-1 ml-1">{{ t('game.supportedAction') }}</label>
        <div class="grid grid-cols-2 gap-1.5">
          <button
            @click="currentOrder.supported_action = 'move'"
            class="text-xs py-2 rounded-lg border transition-all"
            :class="currentOrder.supported_action === 'move' ? 'border-accent bg-accent/10 text-text' : 'border-border text-text-muted'"
          >→ {{ t('game.move') }}</button>
          <button
            @click="currentOrder.supported_action = 'hold'"
            class="text-xs py-2 rounded-lg border transition-all"
            :class="currentOrder.supported_action === 'hold' ? 'border-accent bg-accent/10 text-text' : 'border-border text-text-muted'"
          >⏸️ {{ t('game.hold') }}</button>
        </div>
      </div>

      <div v-if="currentOrder.origin" class="card px-3 py-2.5">
        <p class="font-mono text-sm text-text-secondary">
          {{ formatOrder({
            order_type: currentOrder.order_type,
            unit_type: currentOrder.unit_type,
            origin: currentOrder.origin.toUpperCase(),
            target: currentOrder.target.toUpperCase(),
            supported_unit: currentOrder.supported_unit.toUpperCase(),
            supported_action: currentOrder.supported_action,
          }) }}
        </p>
      </div>

      <p v-if="error" class="text-xs text-error">{{ error }}</p>

      <button @click="addOrder" class="btn-secondary w-full py-2.5 text-sm flex items-center justify-center gap-1.5">
        <span>+</span> {{ t('game.addOrder') }}
      </button>
    </div>

    <div v-if="mode === 'guided' && orders.length > 0" class="mt-4 space-y-2.5">
      <h4 class="text-xs text-text-muted ml-1 flex items-center gap-1.5">
        <span>📝</span> {{ t('game.pendingOrders') }}
      </h4>
      <div
        v-for="(order, idx) in orders"
        :key="order.key"
        class="card px-4 py-3 flex items-center justify-between"
      >
        <div class="min-w-0 flex-1">
          <p class="font-mono text-sm text-text">{{ orderNotation(order) }}</p>
          <p class="text-xs text-text-muted mt-0.5">
            {{ tProvince(order.origin) }} ({{ order.origin }})
            <template v-if="order.target">→ {{ tProvince(order.target) }} ({{ order.target }})</template>
          </p>
        </div>
        <button @click="removeOrder(idx)" class="btn-ghost !text-error shrink-0 ml-3">{{ t('game.remove') }}</button>
      </div>

      <button @click="handleConfirmGuided" :disabled="saving" class="btn-primary w-full py-3.5 text-base">
        {{ saving ? t('game.saving') : t('game.confirmAllOrders') }}
      </button>
    </div>
  </div>
</template>
