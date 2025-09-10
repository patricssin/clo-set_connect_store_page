    // src/emotion.d.ts
    import '@emotion/react';

    declare module '@emotion/react' {
      export interface Theme {
        dark : {
          appBgColor: string,
          backgroundColor: string,
          foregroundColor: string,
          boxShadow:string,
          titleColor: string,
          temperatureColor: string,
          textColor: string,
          hoverBgColor: string,
        };
      }
    }