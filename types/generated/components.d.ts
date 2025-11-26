import type { Schema, Struct } from '@strapi/strapi';

export interface ContentAbout extends Struct.ComponentSchema {
  collectionName: 'components_content_abouts';
  info: {
    displayName: 'About';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface ContentCheckedList extends Struct.ComponentSchema {
  collectionName: 'components_content_checked_lists';
  info: {
    displayName: 'CheckedList';
  };
  attributes: {
    items: Schema.Attribute.Component<'content.list', true>;
    title: Schema.Attribute.String;
  };
}

export interface ContentCustomer extends Struct.ComponentSchema {
  collectionName: 'components_content_customers';
  info: {
    displayName: 'Customer';
  };
  attributes: {
    countryCode: Schema.Attribute.String;
    email: Schema.Attribute.Email;
    fullName: Schema.Attribute.String;
    phone: Schema.Attribute.String;
  };
}

export interface ContentFaq extends Struct.ComponentSchema {
  collectionName: 'components_content_faqs';
  info: {
    displayName: 'Faq';
  };
  attributes: {
    description: Schema.Attribute.Text;
    position: Schema.Attribute.Integer;
    title: Schema.Attribute.String;
  };
}

export interface ContentGallery extends Struct.ComponentSchema {
  collectionName: 'components_content_galleries';
  info: {
    displayName: 'Gallery';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    position: Schema.Attribute.Integer;
    title: Schema.Attribute.String;
  };
}

export interface ContentList extends Struct.ComponentSchema {
  collectionName: 'components_content_lists';
  info: {
    displayName: 'List';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    label: Schema.Attribute.String;
  };
}

export interface ContentLocation extends Struct.ComponentSchema {
  collectionName: 'components_content_locations';
  info: {
    displayName: 'Location';
  };
  attributes: {
    address: Schema.Attribute.String;
    area: Schema.Attribute.String;
    city: Schema.Attribute.String;
    country: Schema.Attribute.Enumeration<
      [
        'United Arab Emirates',
        '\u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062A \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0645\u062A\u062D\u062F\u0629',
      ]
    >;
    latitude: Schema.Attribute.Decimal;
    longitude: Schema.Attribute.Decimal;
  };
}

export interface ContentServiceDetails extends Struct.ComponentSchema {
  collectionName: 'components_content_service_details';
  info: {
    displayName: 'ServiceDetails';
  };
  attributes: {
    counterQuestion: Schema.Attribute.String;
    currencyCode: Schema.Attribute.Enumeration<['AED']>;
    description: Schema.Attribute.Text;
    discountPercentage: Schema.Attribute.Integer;
    exclusive: Schema.Attribute.Boolean;
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    instructionsQuestionText: Schema.Attribute.String;
    list: Schema.Attribute.Component<'content.list', true>;
    maxQuantity: Schema.Attribute.Integer;
    priceAfterDiscount: Schema.Attribute.BigInteger;
    priceBeforeDiscount: Schema.Attribute.BigInteger;
    title: Schema.Attribute.String;
    type: Schema.Attribute.String;
  };
}

export interface ContentTimeRange extends Struct.ComponentSchema {
  collectionName: 'components_content_time_ranges';
  info: {
    displayName: 'TimeRange';
  };
  attributes: {
    endTime: Schema.Attribute.String;
    startTime: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'content.about': ContentAbout;
      'content.checked-list': ContentCheckedList;
      'content.customer': ContentCustomer;
      'content.faq': ContentFaq;
      'content.gallery': ContentGallery;
      'content.list': ContentList;
      'content.location': ContentLocation;
      'content.service-details': ContentServiceDetails;
      'content.time-range': ContentTimeRange;
    }
  }
}
