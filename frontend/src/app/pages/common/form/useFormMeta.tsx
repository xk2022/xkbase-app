// src/app/pages/common/form/useFormMeta.tsx
import {useState} from 'react'

export function useFormMeta<T extends Record<string, unknown>>() {
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)

  const touch =
    (k: keyof T) =>
    () =>
      setTouched((p) => ({...p, [k]: true}))

  const markSubmitted = () => setSubmitted(true)

  const showError = (
    k: keyof T,
    errors: Partial<Record<keyof T, string>>,
  ) => (submitted || touched[k]) && !!errors[k]

  const invalidClass = (
    k: keyof T,
    errors: Partial<Record<keyof T, string>>,
  ) => (showError(k, errors) ? 'is-invalid' : '')

  return {
    touched,
    submitted,
    touch,
    markSubmitted,
    showError,
    invalidClass,
  }
}
