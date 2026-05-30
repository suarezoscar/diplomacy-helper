export const POWERS = [
  { id: 'austria', name: 'Austria-Hungary', color: '#CC2936' },
  { id: 'england', name: 'England', color: '#E69A9D' },
  { id: 'france', name: 'France', color: '#3185FC' },
  { id: 'germany', name: 'Germany', color: '#7D7D7D' },
  { id: 'italy', name: 'Italy', color: '#4CB944' },
  { id: 'russia', name: 'Russia', color: '#9A6FB0' },
  { id: 'turkey', name: 'Turkey', color: '#E2C044' },
]

export const ORDER_TYPES = [
  { id: 'move', label: 'Move', notation: '-' },
  { id: 'hold', label: 'Hold', notation: 'H' },
  { id: 'support', label: 'Support', notation: 'S' },
  { id: 'convoy', label: 'Convoy', notation: 'C' },
]

export const UNIT_TYPES = [
  { id: 'army', label: 'Army', notation: 'A' },
  { id: 'fleet', label: 'Fleet', notation: 'F' },
]

export const PROVINCES = [
  { code: 'Adr', name: 'Adriatic Sea', type: 'sea' },
  { code: 'Aeg', name: 'Aegean Sea', type: 'sea' },
  { code: 'Alb', name: 'Albania', type: 'land' },
  { code: 'Ank', name: 'Ankara', type: 'land', supply: true, power: 'turkey' },
  { code: 'Apu', name: 'Apulia', type: 'coastal' },
  { code: 'Arm', name: 'Armenia', type: 'coastal' },
  { code: 'Bal', name: 'Baltic Sea', type: 'sea' },
  { code: 'Bar', name: 'Barents Sea', type: 'sea' },
  { code: 'Bel', name: 'Belgium', type: 'coastal', supply: true },
  { code: 'Ber', name: 'Berlin', type: 'coastal', supply: true, power: 'germany' },
  { code: 'Bla', name: 'Black Sea', type: 'sea' },
  { code: 'Boh', name: 'Bohemia', type: 'land' },
  { code: 'Bre', name: 'Brest', type: 'coastal', supply: true, power: 'france' },
  { code: 'Bud', name: 'Budapest', type: 'land', supply: true, power: 'austria' },
  { code: 'Bul', name: 'Bulgaria', type: 'coastal', supply: true, coasts: ['ec', 'sc'] },
  { code: 'Bur', name: 'Burgundy', type: 'land' },
  { code: 'Cly', name: 'Clyde', type: 'coastal' },
  { code: 'Con', name: 'Constantinople', type: 'coastal', supply: true, power: 'turkey' },
  { code: 'Den', name: 'Denmark', type: 'coastal', supply: true },
  { code: 'Eas', name: 'Eastern Mediterranean', type: 'sea' },
  { code: 'Edi', name: 'Edinburgh', type: 'coastal', supply: true, power: 'england' },
  { code: 'Eng', name: 'English Channel', type: 'sea' },
  { code: 'Fin', name: 'Finland', type: 'coastal' },
  { code: 'Gal', name: 'Galicia', type: 'land' },
  { code: 'Gas', name: 'Gascony', type: 'coastal' },
  { code: 'Gre', name: 'Greece', type: 'coastal', supply: true },
  { code: 'Hel', name: 'Helgoland Bight', type: 'sea' },
  { code: 'Hol', name: 'Holland', type: 'coastal', supply: true },
  { code: 'Ion', name: 'Ionian Sea', type: 'sea' },
  { code: 'Iri', name: 'Irish Sea', type: 'sea' },
  { code: 'Kie', name: 'Kiel', type: 'coastal', supply: true, power: 'germany' },
  { code: 'Lon', name: 'London', type: 'coastal', supply: true, power: 'england' },
  { code: 'Lvn', name: 'Livonia', type: 'coastal' },
  { code: 'Lvp', name: 'Liverpool', type: 'coastal', supply: true, power: 'england' },
  { code: 'Lyo', name: 'Gulf of Lyon', type: 'sea' },
  { code: 'Mar', name: 'Marseilles', type: 'coastal', supply: true, power: 'france' },
  { code: 'Mid', name: 'Mid-Atlantic Ocean', type: 'sea' },
  { code: 'Mos', name: 'Moscow', type: 'land', supply: true, power: 'russia' },
  { code: 'Mun', name: 'Munich', type: 'land', supply: true, power: 'germany' },
  { code: 'NAf', name: 'North Africa', type: 'coastal' },
  { code: 'NAt', name: 'North Atlantic Ocean', type: 'sea' },
  { code: 'Nap', name: 'Naples', type: 'coastal', supply: true, power: 'italy' },
  { code: 'Nrg', name: 'Norwegian Sea', type: 'sea' },
  { code: 'Nth', name: 'North Sea', type: 'sea' },
  { code: 'Nwy', name: 'Norway', type: 'coastal', supply: true },
  { code: 'Par', name: 'Paris', type: 'land', supply: true, power: 'france' },
  { code: 'Pic', name: 'Picardy', type: 'coastal' },
  { code: 'Pie', name: 'Piedmont', type: 'coastal' },
  { code: 'Por', name: 'Portugal', type: 'coastal', supply: true },
  { code: 'Pru', name: 'Prussia', type: 'coastal' },
  { code: 'Rom', name: 'Rome', type: 'coastal', supply: true, power: 'italy' },
  { code: 'Ruh', name: 'Ruhr', type: 'land' },
  { code: 'Rum', name: 'Rumania', type: 'coastal', supply: true },
  { code: 'Ser', name: 'Serbia', type: 'land', supply: true },
  { code: 'Sev', name: 'Sevastopol', type: 'coastal', supply: true, power: 'russia' },
  { code: 'Sil', name: 'Silesia', type: 'land' },
  { code: 'Ska', name: 'Skagerrak', type: 'sea' },
  { code: 'Smy', name: 'Smyrna', type: 'coastal', supply: true, power: 'turkey' },
  { code: 'Spa', name: 'Spain', type: 'coastal', supply: true, coasts: ['nc', 'sc'] },
  { code: 'StP', name: 'St Petersburg', type: 'coastal', supply: true, power: 'russia', coasts: ['nc', 'sc'] },
  { code: 'Swe', name: 'Sweden', type: 'coastal', supply: true },
  { code: 'Syr', name: 'Syria', type: 'coastal' },
  { code: 'Tri', name: 'Trieste', type: 'coastal', supply: true, power: 'austria' },
  { code: 'Tun', name: 'Tunis', type: 'coastal', supply: true },
  { code: 'Tus', name: 'Tuscany', type: 'coastal' },
  { code: 'Tyn', name: 'Tyrrhenian Sea', type: 'sea' },
  { code: 'Tyr', name: 'Tyrolia', type: 'land' },
  { code: 'Ukr', name: 'Ukraine', type: 'land' },
  { code: 'Ven', name: 'Venice', type: 'coastal', supply: true, power: 'italy' },
  { code: 'Vie', name: 'Vienna', type: 'land', supply: true, power: 'austria' },
  { code: 'Wal', name: 'Wales', type: 'coastal' },
  { code: 'War', name: 'Warsaw', type: 'land', supply: true, power: 'russia' },
  { code: 'Wes', name: 'Western Mediterranean', type: 'sea' },
  { code: 'Yor', name: 'Yorkshire', type: 'coastal' },
]

export function getProvince(code) {
  return PROVINCES.find((p) => p.code === code) || null
}

export function getPower(id) {
  return POWERS.find((p) => p.id === id) || null
}

export function formatOrder(order) {
  if (order.raw_text) return order.raw_text

  const unit = order.unit_type === 'army' ? 'A' : 'F'
  const origin = order.origin

  switch (order.order_type) {
    case 'hold':
      return `${unit} ${origin} H`
    case 'move':
      return `${unit} ${origin} - ${order.target}`
    case 'support':
      if (order.supported_action === 'hold') {
        return `${unit} ${origin} S ${order.supported_unit}`
      }
      return `${unit} ${origin} S ${order.supported_unit} - ${order.target}`
    case 'convoy':
      return `${unit} ${origin} C ${order.supported_unit} - ${order.target}`
    default:
      return `${unit} ${origin}`
  }
}
