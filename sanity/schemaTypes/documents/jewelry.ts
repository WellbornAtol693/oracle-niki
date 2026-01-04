import { defineType, defineField } from 'sanity'

export const jewelry = defineType({
  name: 'jewelry',
  title: 'Jewelry',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'images',
      type: 'array',
      of: [{ type: 'image' }],
      validation: (rule) => rule.min(1).error('At least one image is required'),
    }),
    defineField({
      name: 'price',
      type: 'number',
      //validation: (rule) => rule.required().positive(),//
    }),
    defineField({
      name: 'available',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      initialValue: false,
      description: 'Show this item in featured sections',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'images.0',
      price: 'price',
    },
    prepare({ title, media, price }) {
      return {
        title,
        media,
        subtitle: price ? `$${price.toFixed(2)}` : 'No price',
      }
    },
  },
})
