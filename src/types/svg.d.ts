declare module "*.svg" {
  const src: string;
  export default src;

  // 👇 这里加上 SVGR 的 React 组件类型声明
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
}
