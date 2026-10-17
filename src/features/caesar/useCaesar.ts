import { computed, ref, watch } from 'vue'
import { ALPHABETS, caesar, caesarSteps, mod, parseShift, type AlphabetKey } from '../../ciphers/caesar'

export type Mode = 'cifrar' | 'descifrar'

export function useCaesar(initial = { text: 'Hola mundo', shift: 3 }) {
  const text = ref(initial.text)
  const shift = ref(initial.shift)
  /** Lo que el usuario teclea en el campo de k: puede ser inválido o mayor que n. */
  const kText = ref(String(initial.shift))
  const kError = ref('')
  const kRaw = ref(initial.shift)
  const mode = ref<Mode>('cifrar')
  const alphabetKey = ref<AlphabetKey>('es')

  const alphabet = computed(() => ALPHABETS[alphabetKey.value].letters)
  const signedShift = computed(() => (mode.value === 'cifrar' ? shift.value : -shift.value))
  const output = computed(() => caesar(text.value, signedShift.value, alphabet.value))
  const steps = computed(() => caesarSteps(text.value, signedShift.value, alphabet.value))

  // mantener k dentro de 0..n-1 al cambiar de alfabeto
  watch(alphabet, (a) => {
    shift.value = mod(kRaw.value, a.length)
    if (kError.value === '') kText.value = String(kRaw.value)
  })

  /** Slider y botones − / +: dejan k dentro de 0..n-1 y sincronizan el campo. */
  const setShift = (v: number) => {
    const n = alphabet.value.length
    shift.value = Number.isFinite(v) ? Math.min(Math.max(Math.trunc(v), 0), n - 1) : 0
    kRaw.value = shift.value
    kText.value = String(shift.value)
    kError.value = ''
  }

  /** Campo numérico: acepta cualquier entero; el cálculo usa k mod n y, si es inválido, conserva el último k válido. */
  const typeShift = (input: string) => {
    kText.value = input
    const parsed = parseShift(input)
    if (!parsed.ok) {
      kError.value = parsed.error
      return
    }
    kError.value = ''
    kRaw.value = parsed.value
    shift.value = mod(parsed.value, alphabet.value.length)
  }

  const kNote = computed(() =>
    kError.value === '' && kRaw.value !== shift.value
      ? `k = ${kRaw.value} equivale a k = ${shift.value} (${kRaw.value} mod ${alphabet.value.length}).`
      : '',
  )

  /** Usa la salida como nueva entrada e invierte el modo. */
  const swap = () => {
    text.value = output.value
    mode.value = mode.value === 'cifrar' ? 'descifrar' : 'cifrar'
  }

  return { text, shift, mode, alphabetKey, alphabet, output, steps, setShift, swap, kText, kError, kNote, typeShift }
}
