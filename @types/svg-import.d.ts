declare module "*.svg" {
  import { ReactElement, SVGProps } from "react";

  const ReactComponent: (props: SVGProps<SVGElement>) => ReactElement;
  export default ReactComponent;
}