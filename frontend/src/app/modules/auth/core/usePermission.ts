import { getCurrentSystem } from './AuthHelpers'

export const usePermission = () => {
  const currentSystem = getCurrentSystem()
  const has = (perm: string): boolean => {
    return currentSystem?.permissionDTOS?.some(p => p.name === perm && p.active) ?? false
  }
  return { has }
}