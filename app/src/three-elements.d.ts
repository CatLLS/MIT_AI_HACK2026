import { ThreeElement } from '@react-three/fiber';
import { SplatMesh, SparkRenderer } from '@sparkjsdev/spark';

declare module '@react-three/fiber' {
  interface ThreeElements {
    splatMesh: ThreeElement<typeof SplatMesh>;
    sparkRenderer: ThreeElement<typeof SparkRenderer>;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      splatMesh: any;
      sparkRenderer: any;
    }
  }
}
