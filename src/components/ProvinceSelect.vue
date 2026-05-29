<script setup>
import { ref, computed } from 'vue'
import { PROVINCES } from '@/constants/diplomacy'
import { useI18n } from '@/i18n'

const { t, tProvince } = useI18n()

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const search = ref('')
const showDropdown = ref(false)
const focused = ref(false)

const displayValue = computed(() => {
  if (focused.value && search.value) return search.value
  if (props.modelValue) return `${tProvince(props.modelValue)} (${props.modelValue})`
  return ''
})

const filteredProvinces = computed(() => {
  if (!search.value) return PROVINCES.slice(0, 20)
  const q = search.value.toLowerCase()
  return PROVINCES.filter(
    (p) =>
      p.code.toLowerCase().includes(q) ||
      tProvince(p.code).toLowerCase().includes(q)
  ).slice(0, 12)
})

function onInput(event) {
  search.value = event.target.value
  emit('update:modelValue', event.target.value.toUpperCase())
  showDropdown.value = true
}

function selectProvince(province) {
  emit('update:modelValue', province.code)
  search.value = ''
  showDropdown.value = false
}

function onFocus() {
  focused.value = true
  showDropdown.value = true
}

function onBlur() {
  setTimeout(() => {
    focused.value = false
    search.value = ''
    showDropdown.value = false
  }, 150)
}
</script>

<template>
  <div class="relative">
    <input
      :value="displayValue"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      :placeholder="placeholder || t('province.select')"
      class="w-full font-mono"
      :class="props.modelValue && !focused.value ? '' : 'uppercase'"
    />
    <div
      v-if="showDropdown"
      class="absolute z-20 mt-1 w-full rounded-lg border border-border bg-elevated shadow-xl max-h-48 overflow-y-auto"
    >
      <button
        v-for="p in filteredProvinces"
        :key="p.code"
        @mousedown.prevent="selectProvince(p)"
        class="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-accent/10 transition-colors"
      >
        <span class="text-text flex items-center gap-1.5">
          <span class="text-xs">{{ p.type === 'sea' ? '\uD83C\uDF0A' : p.supply ? '\u2B50' : '\uD83C\uDFF0' }}</span>
          {{ tProvince(p.code) }} <span class="text-xs font-mono text-text-muted">({{ p.code }})</span>
        </span>
      </button>
      <div v-if="filteredProvinces.length === 0" class="px-3 py-2 text-xs text-text-muted">
        {{ t('province.noProvinces') }}
      </div>
    </div>
  </div>
</template>
