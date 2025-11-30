// Fix for lucide-react + React 19 type compatibility
// This override fixes the JSX component type error by extending ReactElement

import * as React from 'react';

declare global {
  namespace JSX {
    interface Element extends React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>> {}
  }
}
