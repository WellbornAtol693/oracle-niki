import { type SchemaTypeDefinition } from 'sanity'
import { jewelry } from './documents/jewelry'
import { clothing } from './documents/clothing'
import { prints } from './documents/prints'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    jewelry,
    clothing,
    prints,
  ],
}
