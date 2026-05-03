export interface AppPasswordInputProps {
  // Define your props here
  exampleProp?: string;
}

export function AppPasswordInput({ exampleProp }: AppPasswordInputProps) {
  console.log(exampleProp);

  return <div>AppPasswordInput component works!</div>;
}
