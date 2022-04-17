import session from 'express';

declare module 'express' {
  interface fieldData {
    fields: FormData.fields;
  }
}
