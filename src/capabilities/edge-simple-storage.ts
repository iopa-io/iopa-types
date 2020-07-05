import { createIopaRef } from '../lib'

export const URN_EDGE_SIMPLE_STORAGE_DEV =
  'urn:io.iopa.simplestorage:edge:development'
export const URN_EDGE_SIMPLE_STORAGE_STAGING =
  'urn:io.iopa.simplestorage:edge:staging'
export const URN_EDGE_SIMPLE_STORAGE_PROD =
  'urn:io.iopa.simplestorage:edge:production'

export interface IEdgeSimpleStorage {
  getSignedUrl(props: {
    bucketPath: string
    method: 'GET' | 'PUT' | 'DELETE' | 'POST'
    expires: number
    extensionHeaders?: {}
    queryParams?: Record<string, string>
    contentMd5?: string
    contentType?: string
  })
}

export const EdgeSimpleStorageDevRef = createIopaRef<IEdgeSimpleStorage>({
  id: URN_EDGE_SIMPLE_STORAGE_DEV,
  description:
    'Simple cloud storage API to get signed URL for given file bucket [development]'
})

export const EdgeSimpleStorageStagingRef = createIopaRef<IEdgeSimpleStorage>({
  id: URN_EDGE_SIMPLE_STORAGE_STAGING,
  description:
    'Simple cloud storage API to get signed URL for given file bucket [staging]'
})

export const EdgeSimpleStorageProdRef = createIopaRef<IEdgeSimpleStorage>({
  id: URN_EDGE_SIMPLE_STORAGE_PROD,
  description:
    'Simple cloud storage API to get signed URL for given file bucket [production]'
})
