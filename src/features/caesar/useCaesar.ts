import { computed, ref, watch } from 'vue'
import { ALPHABETS, caesar, caesarSteps, type AlphabetKey } from '../../ciphers/caesar'

export type Mode = 'cifrar' | 'descifrar'

export function useCaesar(initial = { text: 'Hola mundo', shift: 3 }) {
  const text = ref(initial.text)
  const shift = ref(initial.shift)
  const mode = ref<Mode>('cifrar')
  const alphabetKey = ref<AlphabetKey>('es')

  const alphabet = computed(() => ALPHABETS[alphabetKey.value].letters)
  const signedShift = computed(() => (mode.value === 'cifrar' ? shift.value : -shift.value))
  const output = computed(() => caesar(text.value, signedShift.value, alphabet.value))
  const steps = computed(() => caesarSteps(text.value, signedShift.value, alphabet.value))

  // mantener k dentro de 0..n-1 al cambiar de alfabeto
  watch(alphabet, (a) => {
    if (shift.value >= a.length) shift.value = a.length - 1
  })

  const setShift = (v: number) => {
    const n = alphabet.value.length
    shift.value = Number.isFinite(v) ? Math.min(Math.max(Math.trunc(v), 0), n - 1) : 0
  }

  /** Usa la salida como nueva entrada e invierte el modo. */
  const swap = () => {
    text.value = output.value
    mode.value = mode.value === 'cifrar' ? 'descifrar' : 'cifrar'
  }

  return { text, shift, mode, alphabetKey, alphabet, output, steps, setShift, swap }
}
