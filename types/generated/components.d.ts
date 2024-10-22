import type { Struct, Schema } from '@strapi/strapi';

export interface ContentQuote extends Struct.ComponentSchema {
  collectionName: 'components_content_quotes';
  info: {
    displayName: 'Quote';
    icon: 'message';
    description: '';
  };
  attributes: {
    author: Schema.Attribute.String;
    message: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'content.quote': ContentQuote;
    }
  }
}
