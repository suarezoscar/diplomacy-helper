import { ref } from 'vue'

const STORAGE_KEY = 'app_lang'

const messages = {
  es: {
    app: {
      title: 'Diplomacy Helper',
      subtitle: 'Revelado simultáneo de órdenes para partidas de Diplomacy',
    },
    home: {
      createGame: 'Crear partida',
      joinGame: 'Unirse a partida',
      yourName: 'Tu nombre',
      gameName: 'Nombre de la partida (opcional)',
      gameNamePlaceholder: 'Mi partida de Diplomacy',
      powerAssignment: 'Asignación de potencias',
      manual: 'Manual (el creador asigna)',
      random: 'Aleatoria',
      maxPlayers: 'Máx. jugadores',
      playersCount: '{n} jugadores',
      creating: 'Creando...',
      joining: 'Uniéndose...',
      code: 'Código de la partida',
      enterCodeAndName: 'Introduce un código y tu nombre',
      gameNotFound: 'Partida no encontrada',
      gameAlreadyStarted: 'La partida ya ha empezado',
      errorCreating: 'Error al crear la partida',
      errorJoining: 'Error al unirse a la partida',
      enterName: 'Introduce tu nombre',
    },
    lobby: {
      title: 'Vestíbulo',
      leave: 'Salir',
      shareLink: 'Comparte este enlace',
      copy: 'Copiar',
      copied: '¡Copiado!',
      code: 'Código',
      assignPowers: 'Asignar potencias',
      hideAssignments: 'Ocultar asignaciones',
      random: 'Aleatorio',
      startGame: 'Iniciar partida',
      needAtLeast2: 'Se necesitan al menos 2 jugadores',
      playersReady: '{current}/{max} jugadores listos',
      waitingCreator: 'Esperando a que el creador asigne potencias e inicie la partida...',
      manualAssignment: 'Asignación manual de potencias',
      selectPower: 'Seleccionar potencia...',
      applyAssignments: 'Aplicar asignaciones',
      joinGame: 'Unirse a esta partida',
      gameFull: 'La partida está llena',
      assignAllPowers: 'Asigna todas las potencias primero',
      notInGame: 'No estás en esta partida',
      players: 'Jugadores',
      noPlayers: 'Aún no hay jugadores. ¡Comparte el enlace!',
      you: '(tú)',
      noPower: 'Sin potencia',
      enterYourName: 'Tu nombre',
    },
    game: {
      loading: 'Cargando...',
      power: 'Potencia',
      unassigned: 'Sin asignar',
      history: 'Historial',
      lobby: 'Vestíbulo',
      round: 'Ronda',
      revealed: 'Revelado',
      writing: 'Escribiendo',
      player: 'Jugador',
      yourOrders: 'Tus órdenes',
      confirmed: 'Confirmada',
      confirm: 'Confirmar',
      delete: 'Eliminar',
      orderType: 'Tipo de orden',
      unit: 'Unidad',
      origin: 'Origen',
      target: 'Destino',
      armyConvoyed: 'Ejército convoyado',
      supportedUnit: 'Unidad apoyada (ej. A VIE)',
      supportedAction: 'Acción apoyada',
      move: 'Mover',
      hold: 'Mantener',
      addOrder: 'Añadir orden a la lista',
      pendingOrders: 'Órdenes pendientes (sin guardar)',
      remove: 'Quitar',
      saving: 'Guardando...',
      saveAllOrders: 'Guardar todas las órdenes',
      confirmAllOrders: 'Confirmar todas las órdenes',
      selectOrigin: 'Selecciona una provincia de origen',
      selectTarget: 'Selecciona una provincia de destino',
      addAtLeastOne: 'Añade al menos una orden',
      allOrders: 'Todas las órdenes',
      noOrdersThisRound: 'Sin órdenes en esta ronda.',
      confirmedCount: '{count}/{total} confirmados',
      revealOrders: 'Revelar órdenes',
      nextRound: 'Ronda siguiente',
      creatingRound: 'Creando...',
      waitingCreatorReveal: 'Esperando a que el creador revele las órdenes...',
      rawTextMode: 'Texto libre',
      guided: 'Guiado',
      writeOrdersHint: 'Escribe tus órdenes, una por línea.\nEjemplo:\nA VIE - BUD\nA GAL S A VIE - BUD\nF TRI H',
      writeAtLeastOne: 'Escribe al menos una orden',
      alphaWarning: 'Esta funcionalidad está en fase alpha y puede contener errores.',
      back: 'Atrás',
      backToGame: 'Volver a la partida',
    },
    history: {
      title: 'Historial de órdenes',
      noRoundsPlayed: 'No se han jugado rondas aún.',
      loadingOrders: 'Cargando órdenes...',
      noOrdersInRound: 'Sin órdenes en esta ronda.',
      roundOrders: 'Ronda {n} — Órdenes',
      backToGame: 'Volver a la partida',
    },
    province: {
      select: 'Seleccionar provincia...',
      noProvinces: 'No se encontraron provincias',
    },
    powers: {
      austria: 'Austria-Hungría',
      england: 'Inglaterra',
      france: 'Francia',
      germany: 'Alemania',
      italy: 'Italia',
      russia: 'Rusia',
      turkey: 'Turquía',
    },
    orders: {
      move: 'Mover',
      hold: 'Mantener',
      support: 'Apoyar',
      convoy: 'Convoy',
      army: 'Ejército',
      fleet: 'Flota',
    },
    provinces: {
      Adr: 'Mar Adriático', Aeg: 'Mar Egeo', Alb: 'Albania', Ank: 'Ankara',
      Apu: 'Apulia', Arm: 'Armenia', Bal: 'Mar Báltico', Bar: 'Mar de Barents',
      Bel: 'Bélgica', Ber: 'Berlín', Bla: 'Mar Negro', Boh: 'Bohemia',
      Bre: 'Brest', Bud: 'Budapest', Bul: 'Bulgaria', Bur: 'Borgoña',
      Cly: 'Clyde', Con: 'Constantinopla', Den: 'Dinamarca', Eas: 'Mediterráneo Oriental',
      Edi: 'Edimburgo', Eng: 'Canal de la Mancha', Fin: 'Finlandia', Gal: 'Galitzia',
      Gas: 'Gascuña', Gre: 'Grecia', Hel: 'Helgoland', Hol: 'Holanda',
      Ion: 'Mar Jónico', Iri: 'Mar de Irlanda', Kie: 'Kiel', Lon: 'Londres',
      Lvn: 'Livonia', Lvp: 'Liverpool', Lyo: 'Golfo de León', Mar: 'Marsella',
      Mid: 'Atlántico Medio', Mos: 'Moscú', Mun: 'Múnich', NAf: 'Norte de África',
      NAt: 'Atlántico Norte', Nap: 'Nápoles', Nrg: 'Mar de Noruega', Nth: 'Mar del Norte',
      Nwy: 'Noruega', Par: 'París', Pic: 'Picardía', Pie: 'Piamonte',
      Por: 'Portugal', Pru: 'Prusia', Rom: 'Roma', Ruh: 'Ruhr',
      Rum: 'Rumanía', Ser: 'Serbia', Sev: 'Sebastopol', Sil: 'Silesia',
      Ska: 'Skagerrak', Smy: 'Esmirna', Spa: 'España', StP: 'San Petersburgo',
      Swe: 'Suecia', Syr: 'Siria', Tri: 'Trieste', Tun: 'Túnez',
      Tus: 'Toscana', Tyn: 'Mar Tirreno', Tyr: 'Tirol', Ukr: 'Ucrania',
      Ven: 'Venecia', Vie: 'Viena', Wal: 'Gales', War: 'Varsovia',
      Wes: 'Mediterráneo Occidental', Yor: 'Yorkshire',
    },
    common: {
      backToHome: 'Volver al inicio',
      error: 'Error',
      gameNotFound: 'Partida no encontrada',
      gameAlreadyStarted: 'La partida ya ha empezado',
    },
  },
  en: {
    app: {
      title: 'Diplomacy Helper',
      subtitle: 'Simultaneous order reveal for Diplomacy games',
    },
    home: {
      createGame: 'Create Game',
      joinGame: 'Join Game',
      yourName: 'Your name',
      gameName: 'Game name (optional)',
      gameNamePlaceholder: 'My Diplomacy Game',
      powerAssignment: 'Power assignment',
      manual: 'Manual (creator assigns)',
      random: 'Random',
      maxPlayers: 'Max players',
      playersCount: '{n} players',
      creating: 'Creating...',
      joining: 'Joining...',
      code: 'Game code',
      enterCodeAndName: 'Enter a code and your name',
      gameNotFound: 'Game not found',
      gameAlreadyStarted: 'Game already started',
      errorCreating: 'Error creating game',
      errorJoining: 'Error joining game',
      enterName: 'Enter your name',
    },
    lobby: {
      title: 'Lobby',
      leave: 'Leave',
      shareLink: 'Share this link',
      copy: 'Copy',
      copied: 'Copied!',
      code: 'Code',
      assignPowers: 'Assign powers',
      hideAssignments: 'Hide assignments',
      random: 'Random',
      startGame: 'Start Game',
      needAtLeast2: 'Need at least 2 players',
      playersReady: '{current}/{max} players ready',
      waitingCreator: 'Waiting for the creator to assign powers and start the game...',
      manualAssignment: 'Manual power assignment',
      selectPower: 'Select power...',
      applyAssignments: 'Apply assignments',
      joinGame: 'Join this game',
      gameFull: 'Game is full',
      assignAllPowers: 'Assign all powers first',
      notInGame: 'Not in this game',
      players: 'Players',
      noPlayers: 'No players yet. Share the link!',
      you: '(you)',
      noPower: 'No power',
      enterYourName: 'Your name',
    },
    game: {
      loading: 'Loading...',
      power: 'Power',
      unassigned: 'Unassigned',
      history: 'History',
      lobby: 'Lobby',
      round: 'Round',
      revealed: 'Revealed',
      writing: 'Writing',
      player: 'Player',
      yourOrders: 'Your Orders',
      confirmed: 'Confirmed',
      confirm: 'Confirm',
      delete: 'Delete',
      orderType: 'Order type',
      unit: 'Unit',
      origin: 'Origin',
      target: 'Target',
      armyConvoyed: 'Army being convoyed',
      supportedUnit: 'Supported unit (e.g. A VIE)',
      supportedAction: 'Supported action',
      move: 'Move',
      hold: 'Hold',
      addOrder: 'Add order to list',
      pendingOrders: 'Pending orders (not saved)',
      remove: 'Remove',
      saving: 'Saving...',
      saveAllOrders: 'Save all orders',
      confirmAllOrders: 'Confirm all orders',
      selectOrigin: 'Select an origin province',
      selectTarget: 'Select a target province',
      addAtLeastOne: 'Add at least one order',
      allOrders: 'All Orders',
      noOrdersThisRound: 'No orders this round.',
      confirmedCount: '{count}/{total} confirmed',
      revealOrders: 'Reveal Orders',
      nextRound: 'Next Round',
      creatingRound: 'Creating...',
      waitingCreatorReveal: 'Waiting for the creator to reveal orders...',
      rawTextMode: 'Free Text',
      guided: 'Guided',
      writeOrdersHint: 'Write your orders, one per line.\nExample:\nA VIE - BUD\nA GAL S A VIE - BUD\nF TRI H',
      writeAtLeastOne: 'Write at least one order',
      alphaWarning: 'This feature is in alpha and may contain errors.',
      back: 'Back',
      backToGame: 'Back to game',
    },
    history: {
      title: 'Order History',
      noRoundsPlayed: 'No rounds played yet.',
      loadingOrders: 'Loading orders...',
      noOrdersInRound: 'No orders in this round.',
      roundOrders: 'Round {n} — Orders',
      backToGame: 'Back to game',
    },
    province: {
      select: 'Select province...',
      noProvinces: 'No provinces found',
    },
    powers: {
      austria: 'Austria-Hungary',
      england: 'England',
      france: 'France',
      germany: 'Germany',
      italy: 'Italy',
      russia: 'Russia',
      turkey: 'Turkey',
    },
    orders: {
      move: 'Move',
      hold: 'Hold',
      support: 'Support',
      convoy: 'Convoy',
      army: 'Army',
      fleet: 'Fleet',
    },
    provinces: {
      Adr: 'Adriatic Sea', Aeg: 'Aegean Sea', Alb: 'Albania', Ank: 'Ankara',
      Apu: 'Apulia', Arm: 'Armenia', Bal: 'Baltic Sea', Bar: 'Barents Sea',
      Bel: 'Belgium', Ber: 'Berlin', Bla: 'Black Sea', Boh: 'Bohemia',
      Bre: 'Brest', Bud: 'Budapest', Bul: 'Bulgaria', Bur: 'Burgundy',
      Cly: 'Clyde', Con: 'Constantinople', Den: 'Denmark', Eas: 'Eastern Mediterranean',
      Edi: 'Edinburgh', Eng: 'English Channel', Fin: 'Finland', Gal: 'Galicia',
      Gas: 'Gascony', Gre: 'Greece', Hel: 'Helgoland Bight', Hol: 'Holland',
      Ion: 'Ionian Sea', Iri: 'Irish Sea', Kie: 'Kiel', Lon: 'London',
      Lvn: 'Livonia', Lvp: 'Liverpool', Lyo: 'Gulf of Lyon', Mar: 'Marseilles',
      Mid: 'Mid-Atlantic Ocean', Mos: 'Moscow', Mun: 'Munich', NAf: 'North Africa',
      NAt: 'North Atlantic Ocean', Nap: 'Naples', Nrg: 'Norwegian Sea', Nth: 'North Sea',
      Nwy: 'Norway', Par: 'Paris', Pic: 'Picardy', Pie: 'Piedmont',
      Por: 'Portugal', Pru: 'Prussia', Rom: 'Rome', Ruh: 'Ruhr',
      Rum: 'Rumania', Ser: 'Serbia', Sev: 'Sevastopol', Sil: 'Silesia',
      Ska: 'Skagerrak', Smy: 'Smyrna', Spa: 'Spain', StP: 'St Petersburg',
      Swe: 'Sweden', Syr: 'Syria', Tri: 'Trieste', Tun: 'Tunis',
      Tus: 'Tuscany', Tyn: 'Tyrrhenian Sea', Tyr: 'Tyrolia', Ukr: 'Ukraine',
      Ven: 'Venice', Vie: 'Vienna', Wal: 'Wales', War: 'Warsaw',
      Wes: 'Western Mediterranean', Yor: 'Yorkshire',
    },
    common: {
      backToHome: 'Back to home',
      error: 'Error',
      gameNotFound: 'Game not found',
      gameAlreadyStarted: 'Game already started',
    },
  },
}

const locales = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
]

const currentLocale = ref(localStorage.getItem(STORAGE_KEY) || 'es')

function t(key) {
  const keys = key.split('.')
  let value = messages[currentLocale.value]
  for (const k of keys) {
    if (value == null) return key
    value = value[k]
  }
  return value ?? key
}

function setLocale(locale) {
  currentLocale.value = locale
  localStorage.setItem(STORAGE_KEY, locale)
}

function format(key, params = {}) {
  let str = t(key)
  if (typeof str !== 'string') return key
  for (const [k, v] of Object.entries(params)) {
    str = str.replace(`{${k}}`, v)
  }
  return str
}

function tOrderType(id) {
  return t(`orders.${id}`) || id
}

function tUnitType(id) {
  return t(`orders.${id}`) || id
}

function tPower(id) {
  return t(`powers.${id}`) || id
}

const POWER_INITIALS = {
  austria: 'A', england: 'E', france: 'F', germany: 'G',
  italy: 'I', russia: 'R', turkey: 'T',
}

function tPowerFull(id) {
  const name = tPower(id)
  const initial = POWER_INITIALS[id]
  return initial ? `${name} (${initial})` : name
}

function tProvince(code) {
  const normalized = code.charAt(0).toUpperCase() + code.slice(1).toLowerCase()
  return t(`provinces.${normalized}`) || code
}

export function useI18n() {
  return {
    locale: currentLocale,
    locales,
    t,
    format,
    setLocale,
    tOrderType,
    tUnitType,
    tPower,
    tPowerFull,
    tProvince,
  }
}
