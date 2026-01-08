// src/app/pages/tom/container/detail/Query.ts
import { MOCK_CONTAINER_DETAIL_MAP } from '../__mock__/mockContainerDetail'
import type { ContainerDetail } from './Model'

export async function fetchContainerDetail(id: string): Promise<ContainerDetail> {
  const d = MOCK_CONTAINER_DETAIL_MAP[id]
  if (!d) {
    throw new Error(`ContainerDetail not found: ${id}`)
  }
  return Promise.resolve(d)
}
