export interface AppLoadingProps {
  exampleProp?: string;
}

export function AppLoading({ exampleProp }: AppLoadingProps) {
  console.log(exampleProp);
  return <div>AppLoading component works!</div>;
}
