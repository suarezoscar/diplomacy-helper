/**
 * Visual icons and flags for Diplomacy Helper
 * Uses Unicode emoji for flags and semantic icons
 */

export const POWER_FLAGS = {
  austria: '\uD83C\uDDE6\uD83C\uDDF9',
  england: '\uD83C\uDDEC\uD83C\uDDE7',
  france: '\uD83C\uDDEB\uD83C\uDDF7',
  germany: '\uD83C\uDDE9\uD83C\uDDEA',
  italy: '\uD83C\uDDEE\uD83C\uDDF9',
  russia: '\uD83C\uDDF7\uD83C\uDDFA',
  turkey: '\uD83C\uDDF9\uD83C\uDDF7',
}

export const UNIT_ICONS = {
  army: { icon: '\u2694\uFE0F', label: 'Army' },
  fleet: { icon: '\u2693\uFE0F', label: 'Fleet' },
}

export const ORDER_ICONS = {
  move: { icon: '\u2192', label: 'Move' },
  hold: { icon: '\u23F8\uFE0F', label: 'Hold' },
  support: { icon: '\u269B\uFE0F', label: 'Support' },
  convoy: { icon: '\uD83D\uDEA2', label: 'Convoy' },
}

export const STATUS_ICONS = {
  waiting: { icon: '\u23F3', label: 'Waiting' },
  active: { icon: '\u2694\uFE0F', label: 'Active' },
  writing: { icon: '\u270F\uFE0F', label: 'Writing' },
  revealed: { icon: '\uD83D\uDC41\uFE0F', label: 'Revealed' },
  confirmed: { icon: '\u2705', label: 'Confirmed' },
  draft: { icon: '\uD83D\uDCDD', label: 'Draft' },
}

export function flagFor(powerId) {
  return POWER_FLAGS[powerId] || '\uD83C\uDFF4'
}

export function unitIcon(unitType) {
  return UNIT_ICONS[unitType]?.icon || '?'
}

export function orderIcon(orderType) {
  return ORDER_ICONS[orderType]?.icon || '?'
}
